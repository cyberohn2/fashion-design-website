import { SignupForm } from '@/components/app-components/SignUpForm'

function page() {
  return (
    <main className="py-24 pt-34 md:pt-24 container mx-auto">
      <div className="w-full max-w-sm md:max-w-4xl mx-auto">
        <SignupForm />
      </div>
    </main>
  );
}

export default page

// admin dashboard
// code base restructuring
// forgot pwd and reset pwd 
// order info to user mail feature