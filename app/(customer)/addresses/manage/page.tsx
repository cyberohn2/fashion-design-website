import { getAddresses } from "@/actions/addresses/get-addresses";
import ManageAddresses, {
  type address,
} from "@/components/app-components/address/manage-address";

const page = async () => {
  let addresses: address[];
  addresses = await getAddresses();
  return (
    <main className="pt-24 container mx-auto px-4 min-h-screen">
      <ManageAddresses addresses={addresses} />
    </main>
  );
}

export default page
