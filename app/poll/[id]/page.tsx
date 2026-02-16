import { supabase } from "@/lib/supabaseClient";
import PollUI from "@/components/PollUI";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// FIX 1: Update type definition to Promise
export default async function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  // FIX 2: You MUST await params before using the ID
  const { id } = await params;

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id) // Use the awaited 'id' variable here
    .single();

  if (pollError || !poll) {
    notFound();
  }

  const { data: options, error: optionsError } = await supabase
    .from("options")
    .select("*")
    .eq("poll_id", id) // Use the awaited 'id' variable here
    .order("vote_count", { ascending: false });

  if (optionsError) {
    console.error("Error fetching options:", optionsError);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <PollUI poll={poll} initialOptions={options || []} />
    </main>
  );
}