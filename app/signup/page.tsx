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

// update custom order form to support semi custom orders
// design product page
// implement product card to custom order form workflow