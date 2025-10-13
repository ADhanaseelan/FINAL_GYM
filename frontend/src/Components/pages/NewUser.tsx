// Packages
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

// Css
import "react-toastify/dist/ReactToastify.css";

// Components
import {
  LabelInput,
  RadioGroup,
  CustomDropdown,
  PositiveButton,
  NegativeButton,
} from "../Shared/Components";

// API
import { api } from "../../services/api";

// Form type
type FormData = {
  candidateName: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: string;
  candidateType: string;
  instructor: string;
  goal: string;
  premiumType: string;
  height: number;
  weight: number;
  address: string;
  userName: string;
  password: string;
  dateOfJoining: string;
  userId: string;
};

const NewUser: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      dateOfJoining: today,
      userId: "",
    },
  });

  const candidateType = watch("candidateType");
  const instructor = watch("instructor");
  const premiumType = watch("premiumType"); // months

  const [pricingTable2, setPricingTable2] = useState<
    Record<string, Record<number, number>>
  >({});

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await api.get("/membership-settings");
        if (response.status === 200) {
          const data = response.data; // Array of objects

          const formattedPricing: Record<string, Record<number, number>> = {};

          data.forEach((item: any) => {
            const key = `${item.candidate_type}-${
              item.instructor === "General"
                ? "General Trainer"
                : "Personal Trainer"
            }`;

            const months = Number(item.duration.split(" ")[0]); // "12 Months" -> 12
            const amount = Number(item.amount);

            if (!formattedPricing[key]) {
              formattedPricing[key] = {};
            }

            formattedPricing[key][months] = amount;
          });

          setPricingTable2(formattedPricing);
        }
      } catch (err) {
        console.error("Failed to fetch pricing data", err);
      }
    };

    fetchPricing();
  }, []);

  console.log(pricingTable2);

  // Fetch new user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get("/new-user-id");
        if (response.status === 200) {
          const newId = response.data?.userId || response.data;
          setUserId(newId);
          reset({ dateOfJoining: today, userId: newId });
        }
      } catch (error) {
        console.error("Failed to fetch userId", error);
      }
    };
    fetchUserId();
  }, [reset, today]);

  // Calculate membership details
  const calculateMembership = () => {
    if (!candidateType || !instructor || !premiumType) return null;

    const key = `${candidateType}-${instructor}`;
    const months = Number(premiumType);
    const amount = pricingTable2[key]?.[months] || 0;

    const startDate = today;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    return {
      membershipType: `${candidateType} + ${instructor}`,
      amount,
      duration: months,
      startDate,
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
        dateOfJoining: new Date(data.dateOfJoining).toISOString().split("T")[0],
        trainerType: data.instructor,
      };

      // Register candidate
      const response = await api.post("/register-candidate", payload);

      if (response.status === 201) {
        const membership = calculateMembership();
        toast.success("Candidate added successfully.", {
          position: "top-right",
          autoClose: 1500,
          onClose: () =>
            navigate(`/membership-details/${data.userId}`, {
              state: {
                name: data.candidateName,
                ...membership,
              },
            }),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start w-full p-6 max-md:p-0">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-white rounded-lg border border-gray-300 shadow p-8 max-sm:p-4">
        <h3 className="text-2xl font-semibold mb-6">Candidate Registration</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Candidate Name */}
            <LabelInput
              id="candidateName"
              label="Candidate Name *"
              placeholder="Enter full name"
              {...register("candidateName", { required: "Name is required" })}
              error={errors.candidateName?.message}
            />

            {/* User ID */}
            <LabelInput
              id="userId"
              label="User ID *"
              value={userId}
              {...register("userId")}
              readOnly
            />

            {/* Date of Birth */}
            <LabelInput
              id="dateOfBirth"
              label="Date Of Birth *"
              type="date"
              {...register("dateOfBirth", {
                required: "Date of Birth is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const todayDate = new Date();
                  if (selectedDate >= todayDate) {
                    return "Date of Birth cannot be today or in the future";
                  }
                  return true;
                },
              })}
              error={errors.dateOfBirth?.message}
            />

            {/* Phone Number */}
            <LabelInput
              id="phoneNumber"
              label="Phone Number *"
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              {...register("phoneNumber", {
                required: "Phone is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone must be 10 digits",
                },
              })}
              error={errors.phoneNumber?.message}
            />

            {/* Address */}
            <LabelInput
              id="address"
              label="Address *"
              placeholder="Enter Address"
              {...register("address", { required: "Address is required" })}
              error={errors.address?.message}
            />

            {/* Blood Group */}
            <Controller
              name="bloodGroup"
              control={control}
              rules={{ required: "Blood group is required" }}
              render={({ field, fieldState }) => (
                <CustomDropdown
                  label="Blood Group"
                  options={[
                    { label: "A+ve", value: "A+ve" },
                    { label: "A-ve", value: "A-ve" },
                    { label: "B+ve", value: "B+ve" },
                    { label: "B-ve", value: "B-ve" },
                    { label: "O+ve", value: "O+ve" },
                    { label: "O-ve", value: "O-ve" },
                    { label: "AB+ve", value: "AB+ve" },
                    { label: "AB-ve", value: "AB-ve" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <RadioGroup
                  legend="Gender *"
                  name={field.name}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                  selectedValue={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                />
              )}
            />

            {/* Candidate Type */}
            <Controller
              name="candidateType"
              control={control}
              rules={{ required: "Candidate type is required" }}
              render={({ field }) => (
                <RadioGroup
                  legend="Candidate Type *"
                  name={field.name}
                  options={[
                    { label: "Gym", value: "Gym" },
                    { label: "Cardio", value: "Cardio" },
                  ]}
                  selectedValue={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                />
              )}
            />

            {/* Instructor */}
            <Controller
              name="instructor"
              control={control}
              rules={{ required: "Instructor is required" }}
              render={({ field }) => (
                <RadioGroup
                  legend="Instructor *"
                  name={field.name}
                  options={[
                    { label: "General Trainer", value: "General Trainer" },
                    { label: "Personal Trainer", value: "Personal Trainer" },
                  ]}
                  selectedValue={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                />
              )}
            />

            {/* Goal */}
            <Controller
              name="goal"
              control={control}
              rules={{ required: "Goal is required" }}
              render={({ field }) => (
                <RadioGroup
                  legend="Goal *"
                  name={field.name}
                  options={[
                    { label: "Weight Loss", value: "Weight Loss" },
                    { label: "Weight Gain", value: "Weight Gain" },
                    { label: "Fitness", value: "Fitness" },
                  ]}
                  selectedValue={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                />
              )}
            />

            {/* Premium Type */}
            <Controller
              name="premiumType"
              control={control}
              rules={{ required: "Premium type is required" }}
              render={({ field, fieldState }) => (
                <CustomDropdown
                  label="Membership Duration"
                  options={[
                    { label: "1 Month", value: "1" },
                    { label: "3 Months", value: "3" },
                    { label: "6 Months", value: "6" },
                    { label: "12 Months", value: "12" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Date of Joining */}
            <LabelInput
              id="dateOfJoining"
              label="Date of Joining *"
              type="date"
              defaultValue={today}
              {...register("dateOfJoining", {
                required: "Date of Joining is required",
              })}
              error={errors.dateOfJoining?.message}
            />

            {/* Height */}
            <LabelInput
              id="height"
              label="Height *"
              type="number"
              step="any"
              placeholder="Enter height in cm"
              {...register("height", {
                required: "Height is required",
                valueAsNumber: true,
                min: { value: 0, message: "Height must be positive" },
              })}
              error={errors.height?.message}
            />

            {/* Weight */}
            <LabelInput
              id="weight"
              label="Weight *"
              type="number"
              step="any"
              placeholder="Enter weight in kg"
              {...register("weight", {
                required: "Weight is required",
                valueAsNumber: true,
                min: { value: 0, message: "Weight must be positive" },
              })}
              error={errors.weight?.message}
            />

            {/* Username */}
            <LabelInput
              id="userName"
              label="User Name *"
              placeholder="Enter username"
              {...register("userName", { required: "Username is required" })}
              error={errors.userName?.message}
            />

            {/* Password */}
            <div className="relative">
              <LabelInput
                id="password"
                label="Password *"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={errors.password?.message}
              />
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center pr-8 pt-3">
                <button
                  type="button"
                  tabIndex={-1}
                  className="text-2xl text-gray-500 focus:outline-none p-0 bg-transparent border-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <NegativeButton
              label="Cancel"
              onClick={() => window.location.reload()}
              disabled={loading}
            />
            <PositiveButton
              label={loading ? "Submitting..." : "Next"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
