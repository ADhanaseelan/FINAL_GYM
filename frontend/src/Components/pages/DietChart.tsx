import React, { useState } from 'react';
import DietInput, {
  LabelInput,
  CustomDropdown,
} from '../Shared/Components'; // adjust path as needed

const DietChart: React.FC = () => {
  const [form, setForm] = useState({
    name: 'John Smith',
    userId: '#001',
    date: '15 May 2024',
    dietType: 'weight-loss',
    diet: Array(7).fill(''),
    workout: Array(7).fill(''),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: 'userId' | 'dietType', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGridChange = (
    type: 'diet' | 'workout',
    index: number,
    value: string
  ) => {
    const updated = [...form[type]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [type]: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Diet Chart:', form);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-md:p-0">
      <h2 className="text-xl font-semibold mb-4">Diet Chart</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabelInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <CustomDropdown
            label="User ID"
            value={form.userId}
            options={[{ label: '#001', value: '#001' }]}
            onChange={(value) => handleSelectChange('userId', value)}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabelInput
            label="Date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <CustomDropdown
            label="Diet Type"
            value={form.dietType}
            options={[{ label: 'Weight Loss', value: 'weight-loss' }]}
            onChange={(value) => handleSelectChange('dietType', value)}
          />
        </div>

       {/* Diet & Workout Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Diet Column */}
  <div>
    <h4 className="font-medium mb-2">Diet</h4>
    <div className="space-y-3 border border-[#E6E6E6] p-4 rounded-md">
      {form.diet.map((value, i) => (
        <DietInput
          key={`diet-${i}`}
          label={`Day ${i + 1}:`}
          value={value}
          onChange={(e) => handleGridChange("diet", i, e.target.value)}
        />
      ))}
    </div>
  </div>

  {/* Workout Column */}
  <div>
    <h4 className="font-medium mb-2">Workout</h4>
    <div className="space-y-3 border border-[#E6E6E6] p-4 rounded-md">
      {form.workout.map((value, i) => (
        <DietInput
          key={`workout-${i}`}
          label={`Day ${i + 1}:`}
          value={value}
          onChange={(e) => handleGridChange("workout", i, e.target.value)}
        />
      ))}
    </div>
  </div>
</div>


        {/* Footer */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietChart;
