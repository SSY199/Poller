import CreatePollForm from "@/components/CreatePollForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Real-Time Polls
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Create a poll in seconds, share the link, and watch results update live.
          </p>
        </div>

        <CreatePollForm />

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Built for the <span className="font-semibold text-blue-600">Full-Stack Assignment</span>.
            <br />
            Prioritizing simplicity, real-time updates, and fairness.
          </p>
        </div>

      </div>
    </main>
  );
}