import { useEffect } from "react";
import {
  LabelInput,
  CustomDropdown,
  PositiveButton,
  NegativeButton,
} from "../Shared/Components";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ToastMessage from "../Shared/ToastMessage";
import { api } from "../../services/api";

type MembershipForm = {
  name: string;
  userId: string;
  membershipType: string;
  amount: string;
  duration: string;
  startDate: string;
  endDate: string;
  paymentType: string;
  status?: string;
};

const Membership = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id;
  const navigate = useNavigate();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MembershipForm>({
    defaultValues: {
      name: "",
      userId: userId,
      membershipType: "",
      amount: "0",
      duration: "0",
      startDate: "0",
      endDate: "0",
      paymentType: "",
      status: "Active",
    },
  });

  const name = watch("name");
  const membershipType = watch("membershipType");
  const amount = watch("amount");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const status = watch("status");

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await api.get(`/get-membership/${userId}`);
        const data = response.data;

        setValue("name", data.candidateName || "");
        setValue("membershipType", data.membershipType || "0");
        setValue("amount", data.amount?.toString() || "0");
        setValue("duration", data.durationMonths?.toString() || "0");
        setValue("startDate", data.startDate || "0");
        setValue("endDate", data.endDate || "0");
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };

    if (userId) fetchMembership();
  }, [userId, setValue]);

  const handleCancel = () => {
    navigate(-2);
  };

  const onSubmit = (data: MembershipForm) => {
    toast(
      <ToastMessage
        title="Success"
        description="Membership details saved successfully."
        type="success"
      />
    );
    console.log("Saved data:", data);
    navigate("/user-overview");
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50 max-md:p-0">
      {/* Profile Section */}
      <div className="flex items-center justify-between bg-white shadow rounded-lg border border-[#E6E6E6] p-8 max-sm:p-2 ">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center font-days bg-white text-black border-[3px] border-[#A4A4A4] rounded-full text-xl font-bold">
            {name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-sm text-gray-700">ID: {userId || "001"}</p>
            <p className="text-xs text-gray-400">
              Since {startDate !== "0" ? startDate : "N/A"}
            </p>
          </div>
        </div>
        <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium">
          {status || "Active"}
        </span>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Membership</p>
          <span className="text-lg font-bold">{membershipType || "0"}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Membership Amount</p>
          <span className="text-lg font-bold">{amount || "0"}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Start Date</p>
          <span className="text-lg font-bold">
            {startDate !== "0" ? startDate : "0"}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">End Date</p>
          <span className="text-lg font-bold">
            {endDate !== "0" ? endDate : "0"}
          </span>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <LabelInput label="Name" {...register("name")} />

        <CustomDropdown
          label="Membership Type"
          value={membershipType}
          options={[
            { label: "Golden", value: "Golden" },
            { label: "Silver", value: "Silver" },
            { label: "Platinum", value: "Platinum" },
            { label: "Diamond", value: "Diamond" },
          ]}
          onChange={(value) => setValue("membershipType", value)}
        />

        <LabelInput label="Amount" {...register("amount")} />
        <LabelInput label="Duration (Months)" {...register("duration")} />

        {/* ✅ Start Date editable */}
        <LabelInput type="date" label="Start Date" {...register("startDate")} />
        {/* ✅ End Date editable */}
        <LabelInput type="date" label="End Date" {...register("endDate")} />

        <CustomDropdown
          label="Payment Type"
          value={watch("paymentType")}
          options={[
            { label: "Online", value: "Online" },
            { label: "Cash", value: "Cash" },
            { label: "UPI", value: "UPI" },
          ]}
          onChange={(value) => setValue("paymentType", value)}
        />
      </form>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 justify-end">
        <NegativeButton label="Cancel" onClick={handleCancel} />
        <PositiveButton
          label={isSubmitting ? "Saving..." : "Save"}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default Membership;
