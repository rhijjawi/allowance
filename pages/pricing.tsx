import { useAlerts } from "@/components/contexts/alertHandler";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { Card, Col, Grid, Title } from "@tremor/react";
import { motion } from "framer-motion";
import { Context, useState } from "react";
import { Button } from "@tremor/react";
import Stripe from "stripe";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const getStaticProps = async (context: any) => {
  let data;
  try {
    const res = await fetch(
      "http://expenses.ramzihijjawi.me:3000/api/stripe/getProds",
    );
    data = await res.json();
  } catch (e) {
    data = [];
  }
  return { props: { prods: data }, revalidate: 60 };
};
const MotionButton = motion(Button);
export default function PricingPage({ prods }: { prods: Stripe.Price[] }) {
  const [loading, setLoading] = useState<any>({});
  const { addAlert } = useAlerts();
  return (
    <>
      <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
        <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6  lg:px-8">
          <Card
            className={`mx-auto my-auto mt-5 w-full max-w-[80%] divide-y divide-gray-200 rounded-lg border-2 shadow-2xl `}
          >
            <Title>Our Plans</Title>
            <div className="h-96 grid grid-rows-1 grid-cols-3">
            {prods.map((i: Stripe.Price, index: number) => (
              <Card className="mx-auto top-0 h-full inline-block text-center">
                <Title className="mx-auto w-fit">
                  {(i.product as { name: string }).name.split(" - ")[1]}
                </Title>
                <p className="select-none text-xs text-black">
                  {(i.product as { description: string }).description}
                </p>
                <p className="select-none py-1 text-emerald-500">
                  {i.billing_scheme == "per_unit" &&
                    currFormatter(i.unit_amount! / 100, "EUR")}{" "}
                  {i.type == "recurring"
                    ? `per ${i.recurring?.interval}`
                    : `one time`}
                </p>
                <MotionButton
                  loading={loading[i.id]}
                  disabled={loading[i.id]}
                  onClick={async () => {
                    setLoading({ ...loading, [i.id]: true });
                    fetch("/api/stripe/createCheckoutSession", {
                      method: "POST",
                      body: JSON.stringify({
                        item: [i.id, Boolean(i.type == "recurring")],
                      }) as any,
                    }).then(async (res) => {
                      if (res.status == 200) {
                        setLoading({ ...loading, [i.id]: false });
                        const resp = await res.json();
                        window.open(resp.goto, "_self");
                      } else {
                        addAlert(
                          "error",
                          "Something went wrong. Please try again later, or contact us if the problem persists.",
                          5000,
                        );
                      }
                    });
                  }}
                  className="left-0 right-0 mx-auto mt-5 rounded-md bg-indigo-500 px-3 py-1 text-white"
                  icon={ArrowRightIcon}
                  iconPosition="right"
                >
                  {i.type == "recurring" ? `Subscribe` : "Pay"}
                </MotionButton>
              </Card>
            ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
