import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LabelInput,
  CustomDropdown,
  PositiveButton,
} from "../Shared/Components";
import { api } from "../../services/api";

type MembershipForm = {
  candidateType: string;
  instructor: string;
  duration: string;
  amount: string;
};

const defaultValues = {
  candidateType: "",
  instructor: "",
  duration: "",
  amount: "",
};

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const {
    register: registerGym,
    handleSubmit: handleSubmitGym,
    control: controlGym,
    formState: { errors: errorsGym },
    reset: resetGym,
  } = useForm<MembershipForm>({
    defaultValues: { ...defaultValues, candidateType: "Gym" },
  });

  const {
    register: registerCardio,
    handleSubmit: handleSubmitCardio,
    control: controlCardio,
    formState: { errors: errorsCardio },
    reset: resetCardio,
  } = useForm<MembershipForm>({
    defaultValues: { ...defaultValues, candidateType: "Cardio" },
  });

  const onSubmitBoth = async (
    dataGym: MembershipForm,
    dataCardio: MembershipForm
  ) => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        api.post("/settings/gym", dataGym),
        api.post("/settings/cardio", dataCardio),
      ]);

      if (responses[0].status === 201 && responses[1].status === 201) {
        toast.success("Settings saved successfully", { autoClose: 1500 });
        resetGym();
        resetCardio();
        setIsEditable(false); // Disable editing and hide Save button
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };
const handleSubmitBoth = async () => {
  let gymData: MembershipForm | null = null;
  let cardioData: MembershipForm | null = null;

  // Validate Gym
  await handleSubmitGym(
    (data) => {
      gymData = data;
    },
    () => {
      gymData = null; // Gym has errors
    }
  )();

  // Validate Cardio
  await handleSubmitCardio(
    (data) => {
      cardioData = data;
    },
    () => {
      cardioData = null; // Cardio has errors
    }
  )();

  // If either has errors, stop
  if (!gymData || !cardioData) return;

  // Both valid, submit
  onSubmitBoth(gymData, cardioData);
};


  return (
    <div className="w-full min-h-screen p-8 max-md:p-2 bg-white">
      <ToastContainer />
      <div className="flex flex-col gap-10">
        {/* Edit Button */}
        <div className="flex justify-end mt-2 mb-4">
          {!isEditable && (
            <PositiveButton
              label="Edit"
              disabled={loading}
              onClick={() => setIsEditable(true)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gym Membership */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <h2 className="font-semibold text-xl mb-4">Gym Membership</h2>
            <div className="flex flex-col gap-4">
              <LabelInput
                id="gym-candidateType"
                label="Candidate Type"
                className="w-full"
                disabled
                {...registerGym("candidateType")}
              />

              <Controller
                name="instructor"
                control={controlGym}
                rules={{ required: "Instructor is required" }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Instructor"
                    options={[
                      { label: "General Trainer", value: "General" },
                      { label: "Personal Trainer", value: "Special" },
                      
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={!isEditable}
                    error={fieldState.error?.message}
                    placeholder="Select Instructor"
                    className="w-full"
                  />
                )}
              />

              <Controller
                name="duration"
                control={controlGym}
                rules={{ required: "Duration is required" }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Duration"
                    options={[
                      { label: "1 Month", value: "1 Month" },
                      { label: "3 Months", value: "3 Months" },
                      { label: "6 Months", value: "6 Months" },
                      { label: "12 Months", value: "12 Months" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={!isEditable}
                    error={fieldState.error?.message}
                    placeholder="Select Duration"
                    className="w-full"
                  />
                )}
              />

              <LabelInput
                id="gym-amount"
                label="Amount"
                className="w-full"
                placeholder="Enter amount"
                disabled={!isEditable}
                {...registerGym("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^₹?\d+(\.\d{1,2})?$/,
                    message: "Enter a valid amount",
                  },
                })}
                error={errorsGym.amount?.message}
              />
            </div>
          </form>

          {/* Cardio Membership */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <h2 className="font-semibold text-xl mb-4">Cardio Membership</h2>
            <div className="flex flex-col gap-4">
              <LabelInput
                id="cardio-candidateType"
                label="Candidate Type"
                className="w-full"
                disabled
                {...registerCardio("candidateType")}
              />

              <Controller
                name="instructor"
                control={controlCardio}
                rules={{ required: "Instructor is required" }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Instructor"
                    options={[
                      { label: "General Trainer", value: "General" },
                      { label: "Personal Trainer", value: "Special" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={!isEditable}
                    error={fieldState.error?.message}
                    placeholder="Select Instructor"
                    className="w-full"
                  />
                )}
              />

              <Controller
                name="duration"
                control={controlCardio}
                rules={{ required: "Duration is required" }}
                render={({ field, fieldState }) => (
                  <CustomDropdown
                    label="Duration"
                    options={[
                      { label: "1 Month", value: "1 Month" },
                      { label: "3 Months", value: "3 Months" },
                      { label: "6 Months", value: "6 Months" },
                      { label: "12 Months", value: "12 Months" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={!isEditable}
                    error={fieldState.error?.message}
                    placeholder="Select Duration"
                    className="w-full"
                  />
                )}
              />

              <LabelInput
                id="cardio-amount"
                label="Amount"
                className="w-full"
                placeholder="Enter amount"
                disabled={!isEditable}
                {...registerCardio("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^₹?\d+(\.\d{1,2})?$/,
                    message: "Enter a valid amount",
                  },
                })}
                error={errorsCardio.amount?.message}
              />
            </div>
          </form>
        </div>

        {/* Save Button */}
        {isEditable && (
          <div className="flex justify-end mt-6">
            <PositiveButton
              label="Save"
              onClick={handleSubmitBoth}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
