// Enhanced job posting creation form with modern design and better UX

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/services/apiService";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const serviceCategories = [
  'Software Engineering', 'Data Science', 'DevOps', 'Product Management',
  'UI/UX Design', 'QA & Testing', 'Cybersecurity', 'Cloud Computing',
  'Mobile Development', 'Frontend Development', 'Backend Development',
  'Full Stack Development', 'AI/Machine Learning', 'Data Engineering',
  'Systems Architecture', 'Technical Support', 'Developer Relations',
  'Engineering Management', 'Other'
];

export function CreateServiceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    isActive: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const promise = createService({
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      });

      await toast.promise(promise, {
        loading: 'Creating your job posting...',
        success: () => {
          setTimeout(() => router.push('/partner/services'), 1500);
          return <b>Job posting created successfully!</b>;
        },
        error: (err) => {
          const errorMessage = err instanceof Error && 'response' in err && 
            err.response && typeof err.response === 'object' && 
            'data' in err.response && err.response.data && 
            typeof err.response.data === 'object' && 'message' in err.response.data
            ? String(err.response.data.message)
            : "Failed to create job posting!";
          return <b>{errorMessage}</b>;
        },
      });
    } catch (error) {
      console.error("Job posting creation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestPrice = (category: string) => {
    const suggestions: Record<string, number> = {
      'Software Engineering': 120000,
      'Data Science': 130000,
      'DevOps': 125000,
      'Product Management': 140000,
      'UI/UX Design': 110000,
      'QA & Testing': 90000,
      'Cybersecurity': 135000,
      'Cloud Computing': 140000,
      'Frontend Development': 115000,
      'Backend Development': 125000,
      'Other': 100000
    };
    
    return suggestions[category] || 100000;
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      price: suggestPrice(category).toString()
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Job Posting</h2>
        <p className="text-slate-500">Post an open role to candidates on CareerSync</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-900">
            Job Title
          </label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Senior Full Stack Engineer"
            value={formData.name}
            onChange={handleChange}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {serviceCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  formData.category === category
                    ? 'border-blue-500 bg-blue-500/20 text-[#1e40af]'
                    : 'border-slate-300 bg-white/50 text-slate-600 hover:border-gray-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {formData.category === 'Other' && (
            <Input
              placeholder="Enter custom category"
              value={formData.category === 'Other' ? '' : formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-2"
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-900">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your service in detail. What's included? What makes you special?"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-slate-900">
              Price (₹)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="500"
              value={formData.price}
              onChange={handleChange}
              required
              min="50"
              max="10000"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
            {formData.category && (
              <p className="text-xs text-slate-600">
                Suggested: ₹{suggestPrice(formData.category)} for {formData.category}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium text-slate-900">
              Duration (minutes)
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select duration</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="240">4 hours</option>
              <option value="300">5 hours</option>
              <option value="360">6 hours</option>
              <option value="480">8 hours (Full day)</option>
            </select>
          </div>
        </div>

        {/* Service Status */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 bg-slate-100 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-900">
            Make this service active immediately
          </label>
        </div>

        {/* Preview */}
        {formData.name && formData.category && formData.price && (
          <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-300">
            <h4 className="font-semibold text-slate-900 mb-2">Preview</h4>
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-slate-900">{formData.name}</h5>
              <p className="text-sm text-slate-500 mb-2">{formData.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-[#1e40af] font-bold">₹{formData.price}</span>
                {formData.duration && (
                  <span className="text-slate-500 text-sm">
                    {Number(formData.duration) >= 60 
                      ? `${Math.floor(Number(formData.duration) / 60)}h ${Number(formData.duration) % 60 ? Number(formData.duration) % 60 + 'm' : ''}`
                      : `${formData.duration}m`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.name || !formData.category || !formData.price || !formData.duration}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating service...
            </div>
          ) : (
            'Create Service'
          )}
        </Button>
      </form>
    </div>
  );
}