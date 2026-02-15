"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function CreatePollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // Start with 2 empty options
  const [loading, setLoading] = useState(false);

  // Handle adding a new option input
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Handle changing text in an option input
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (!question.trim()) {
      alert("Oops, you forgot something! Please enter a question for your poll.");
      setLoading(false);
      return;
    }
    if(validOptions.length < 2) {
      alert("Oops, you forgot something! Please enter at least 2 options for your poll.");
      setLoading(false);
      return;
    }

    try {
      //  Insert Poll
      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .insert([{ question }])
        .select()
        .single();

      if (pollError) throw pollError;

      const optionsData = validOptions.map((opt) => ({
        poll_id: pollData.id,
        option_text: opt,
      }));

      const { error: optionsError } = await supabase
        .from("options")
        .insert(optionsData);

      if (optionsError) throw optionsError;


      router.push(`/poll/${pollData.id}`);
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a Poll</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
          placeholder="What question do you want to ask?"
          required
        />
      </div>

      {/* Options Inputs */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
            placeholder={`Option ${index + 1}`}
            required={index < 2} 
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={addOption}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add another option
        </Button>
      </div>

      {/* Submit Button */} 
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 cursor-pointer"
      >
        {loading ? "Creating..." : "Create Poll"}
      </Button>
    </form>
  );
}