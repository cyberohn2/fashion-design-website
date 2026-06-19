import CreateDressForm from "@/components/admin-components/product/create-dress-form"

const page = () => {
  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
        <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <CreateDressForm />
        </div>
    </main>
  )
}

export default page
