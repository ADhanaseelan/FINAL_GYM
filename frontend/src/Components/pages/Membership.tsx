import { useEffect, useState } from "react";
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

  const [membershipHistory, setMembershipHistory] = useState<any[]>([]);
  const [latestMembership, setLatestMembership] = useState<any>(null);

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
      amount: "",
      duration: "1",
      startDate: "",
      endDate: "",
      paymentType: "",
      status: "Active",
    },
  });

  const name = watch("name");
  const duration = watch("duration");
  const startDate = watch("startDate");
  const paymentType = watch("paymentType");

  useEffect(() => {
    if (!duration) return;

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(duration));

    const formattedEndDate = end.toISOString().split("T")[0];
    setValue("endDate", formattedEndDate);
  }, [duration, startDate, setValue]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await api.get(`/get-old-membership/${userId}`);
        const data = response.data;

        setValue("name", data.candidateName || "");

        if (data.latestMembership) {
          setLatestMembership(data.latestMembership);

          setValue("amount", data.latestMembership.amount || "");
          setValue(
            "duration",
            data.latestMembership.durationMonths?.toString() || "1"
          );
          setValue(
            "startDate",
            data.latestMembership.startDate
              ? formatDate(data.latestMembership.startDate)
              : ""
          );
          setValue(
            "endDate",
            data.latestMembership.endDate
              ? formatDate(data.latestMembership.endDate)
              : ""
          );
        }

        setMembershipHistory(data.membershipHistory || []);
      } catch (error) {
        console.error("Error fetching membership:", error);
      }
    };

    if (userId) fetchMembership();
  }, [userId, setValue]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const getPaymentStatus = (endDate: string) => {
    if (!endDate) return "N/A";
    const today = new Date();
    const expiry = new Date(endDate);
    return expiry >= today ? "Active" : "Expired";
  };

  const handleCancel = () => {
    navigate(-2);
  };

  const validateForm = (data: MembershipForm) => {
    if (!data.name.trim()) return "Name is required";
    if (!data.amount.trim()) return "Amount is required";
    if (!data.duration) return "Duration is required";
    if (!data.startDate) return "Start Date is required";
    if (!data.endDate) return "End Date is required";
    if (!data.paymentType.trim()) return "Payment Type is required"; // <-- added check
    return null;
  };

  const onSubmit = async (data: MembershipForm) => {
    const error = validateForm(data);
    if (error) {
      toast(<ToastMessage title="Error" description={error} type="error" />);
      return;
    }

    try {
      const payload = {
        ...data,
        memberName: data.name,
      };

      await api.put(`/upgrade-premium`, payload);

      toast(
        <ToastMessage
          title="Success"
          description="Membership details saved successfully."
          type="success"
        />
      );

      const response = await api.get(`/get-old-membership/${userId}`);
      setLatestMembership(response.data.latestMembership);
      setMembershipHistory(response.data.membershipHistory || []);
    } catch (error) {
      console.error("Error saving membership:", error);
    }
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
            <h3 className="ont-bold text-[32px] leading-[48px] tracking-normal">
              {name}
            </h3>
            <p className="ont-semibold text-[18px] leading-[27px] tracking-normal">
              ID: {userId || "001"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-start">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Membership
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {latestMembership?.durationMonths
              ? `${latestMembership.durationMonths} Months`
              : "Not Available"}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Membership Amount
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {latestMembership?.amount || "0"}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Start Date
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {latestMembership?.startDate && latestMembership.startDate !== "0"
              ? latestMembership.startDate
              : "N/A"}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="font-normal text-sm leading-5 tracking-normal text-[#667085]">
            End Date
          </p>
          <span className="font-bold text-2xl leading-8 tracking-normal">
            {latestMembership?.endDate && latestMembership.endDate !== "0"
              ? latestMembership.endDate
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <LabelInput label="Name" {...register("name")} />
        <LabelInput label="Amount" {...register("amount")} />

        <CustomDropdown
          label="Duration (Months)"
          value={duration}
          options={[
            { label: "1 Month", value: "1" },
            { label: "3 Months", value: "3" },
            { label: "6 Months", value: "6" },
            { label: "12 Months", value: "12" },
          ]}
          onChange={(value) => setValue("duration", value)}
        />

        <LabelInput type="date" label="Start Date" {...register("startDate")} />
        <LabelInput type="date" label="End Date" {...register("endDate")} />

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
          label={isSubmitting ? "Saving..." : "Save"}
          onClick={handleSubmit(onSubmit)}
        />
      </div>

      {/* Membership History Table */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Membership History</h3>
        {membershipHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No membership history available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">S.No</th>
                  <th className="border p-2 text-left">Amount</th>
                  <th className="border p-2 text-left">Duration (Months)</th>
                  <th className="border p-2 text-left">Start Date</th>
                  <th className="border p-2 text-left">End Date</th>
                  <th className="border p-2 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {membershipHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.amount}</td>
                    <td className="border p-2">{item.durationMonths}</td>
                    <td className="border p-2">{item.startDate}</td>
                    <td className="border p-2">{item.endDate}</td>
                    <td
                      className={`border p-2 font-medium ${
                        getPaymentStatus(item.endDate) === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {getPaymentStatus(item.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;
