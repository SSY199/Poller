"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [pollLink, setPollLink] = useState(""); 

  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (!question.trim() || validOptions.length < 2) {
      alert("Please enter a question and at least 2 options.");
      setLoading(false);
      return;
    }

    try {
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert([{ question }])
        .select()
        .single();

      if (pollError || !poll)
        throw new Error(pollError?.message || "Failed to create poll");

      const optionsData = validOptions.map((opt) => ({
        poll_id: poll.id,
        option_text: opt,
      }));

      await supabase.from("options").insert(optionsData);

      const link = `${window.location.origin}/poll/${poll.id}`;
      setPollLink(link);
    } catch (error) {
      console.error(error);
      alert("Error creating poll");
    } finally {
      setLoading(false);
    }
  };

  if (pollLink) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md border-2 border-green-500">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Poll Created!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-gray-600">
            Copy this link and share it with others:
          </p>

          <Input
            readOnly
            value={pollLink}
            className="text-center font-mono bg-gray-50 cursor-text"
            onClick={(e) => e.currentTarget.select()} // Auto-select text on click
          />

          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => navigator.clipboard.writeText(pollLink)}
          >
            Copy Link
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(pollLink, "_blank")}
          >
            Open in New Tab
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Create a New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your question?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.map((opt, index) => (
              <Input
                key={index}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="mb-2"
                required={index < 2}
              />
            ))}
            <Button
              type="button"
              variant="ghost"
              onClick={addOption}
              className="w-full"
            >
              + Add Option
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Generate Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
