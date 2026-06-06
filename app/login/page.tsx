import { LoginForm } from "@/components/app-components/LoginForm"

const page = () => {
  return (
    <main className="py-24 pt-34 md:pt-24 container mx-auto">
      <div className="w-full max-w-sm md:max-w-4xl mx-auto">
        <LoginForm />
      </div>
    </main>
  );
}

export default page
