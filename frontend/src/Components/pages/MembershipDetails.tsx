// Packages
import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";

// Components
import {
  LabelInput,
  CustomDropdown,
  PositiveButton,
  NegativeButton,
} from "../Shared/Components";
import { toast } from "react-toastify";
import ToastMessage from "../Shared/ToastMessage";

// Api
import { api } from "../../services/api";

type MembershipForm = {
  name: string;
  userId: string;
  amount: number;
  duration: number;
  startDate: string;
  endDate: string;
  paymentType: string;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const MembershipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id;
  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state as Partial<MembershipForm>;

  const { register, control, setValue, handleSubmit, formState } =
    useForm<MembershipForm>({
      defaultValues: {
        name: initialData?.name || "",
        userId,
        amount: initialData?.amount || 0,
        duration: initialData?.duration || 0,
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        paymentType: initialData?.paymentType || "",
      },
    });

  const startDate = useWatch({ control, name: "startDate" });
  const duration = useWatch({ control, name: "duration" });
  const endDate = useWatch({ control, name: "endDate" });
  const paymentType = useWatch({ control, name: "paymentType" });

  // Recalculate end date when startDate or duration changes
  useEffect(() => {
    if (startDate && duration) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + Number(duration));
      setValue("endDate", end.toISOString().split("T")[0]);
    }
  }, [startDate, duration, setValue]);

  const handleCancel = async () => {
    try {
      await api.delete(`/remove-candidate/${userId}`);
      toast(
        <ToastMessage
          title="Deleted"
          description="Candidate removed successfully."
          type="success"
        />
      );
      navigate("/new-member");
    } catch (error) {
      toast(
        <ToastMessage
          title="Error"
          description="Failed to remove candidate."
          type="error"
        />
      );
    }
  };

  const onSubmit = async (data: MembershipForm) => {
    try {
      const payload = {
        userId: data.userId,
        memberName: data.name,
        amount: data.amount,
        duration: data.duration,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentType: data.paymentType,
      };

      const response = await api.post("/register-membership", payload);

      if (response.status == 200)
        toast(
          <ToastMessage
            title="Success"
            description="Membership registered successfully."
            type="success"
          />
        );

      navigate("/member-list");
    } catch (error) {
      toast(
        <ToastMessage
          title="Error"
          description="Failed to register membership."
          type="error"
        />
      );
    }
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50 max-md:p-0">
      {/* Profile Section */}
      <div className="flex items-center justify-between bg-white shadow rounded-lg border border-[#E6E6E6] p-8 max-sm:p-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center font-days bg-white text-black border-[3px] border-[#A4A4A4] rounded-full text-xl font-bold">
            {String(initialData?.name)
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-bold text-[32px] leading-[48px] tracking-normal">
              {initialData?.name}
            </h3>
            <p className="font-semibold text-[18px] leading-[27px] tracking-normal">
              ID: {userId || "001"}
            </p>
            <p className="font-normal text-[#667085] text-[14px] leading-[20px] tracking-normal">
              Date Entered: {formatDate(startDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-start">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Membership
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {duration} Months
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-start">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Membership Amount
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {initialData?.amount || 0}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-start">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Start Date
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {formatDate(startDate)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-start">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            End Date
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {formatDate(endDate)}
          </span>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <LabelInput label="Name" {...register("name")} readOnly />
        <LabelInput
          label="Amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
          readOnly
        />
        <LabelInput
          label="Duration (Months)"
          type="number"
          {...register("duration", { valueAsNumber: true })}
          readOnly
        />
        <LabelInput type="date" label="Start Date" {...register("startDate")} />
        <LabelInput
          type="date"
          label="End Date"
          {...register("endDate")}
          readOnly
        />
        <CustomDropdown
          label="Payment Type"
          value={paymentType}
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
          label={formState.isSubmitting ? "Saving..." : "Save"}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default MembershipDetails;
