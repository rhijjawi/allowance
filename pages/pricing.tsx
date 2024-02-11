import { useAlerts } from "@/components/contexts/alertHandler";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { Card, Col, Grid, Title } from "@tremor/react";
import { motion } from "framer-motion";
import { Context, useEffect, useState } from "react";
import { Button } from "@tremor/react";
import Stripe from "stripe";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useGuardianOnboarding } from "@/components/contexts/GuardianOnboardingCTX";

export const getStaticProps = async (context: any) => {
  let data;
  try {
    const res = await fetch(
      process.env.NODE_ENV == "development" ? "http://expenses.ramzihijjawi.me:3000/api/stripe/getProds" :  "https://logmoney.app/api/stripe/getProds",
    );
    data = await res.json();
    console.log(data)
  } catch (e) {
    data = [];
  }
  return { props: { prods: data }, revalidate: 60 };
};
const MotionButton = motion(Button, {forwardMotionProps : true});

export default function PricingPage({ prods }: { prods: Stripe.Price[] }) {
  const [loading, setLoading] = useState<any>({});
  const { addAlert } = useAlerts();
  const {user, isSignedIn, isLoaded} = useUser();
  const router = useRouter()
  const {hasValidStripeSubscription, subscriptionId} = useGuardianOnboarding()
  useEffect(()=>{
    console.log(hasValidStripeSubscription, subscriptionId)
  }, [hasValidStripeSubscription])
  return (
    <>
      <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
        <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
          <Card
            className={`mx-auto my-auto mt-5 w-full max-w-[80%] divide-gray-200 rounded-lg border-2 shadow-2xl `}
          >
            <p className="mb-12 text-center text-3xl">Our Plans</p>
            <div className="h-fit grid grid-rows-1 grid-cols-3">
            {prods.map((i: Stripe.Price, index: number) => {
              return (
                <Card className="mx-auto w-[90%] top-0 h-full inline-block text-center">
                  <Title className="mx-auto w-fit">
                    {(i.product as { name: string; }).name.split(" - ")[1]}
                  </Title>
                  <p className="select-none text-xs  dark:text-stone-200">
                    {(i.product as { description: string; }).description}
                  </p>
                  <p className="select-none py-1 text-emerald-500">
                    {i.billing_scheme == "per_unit" &&
                      currFormatter(i.unit_amount! / 100, i.currency)}{" "}
                    {i.type == "recurring"
                      ? `per ${i.recurring?.interval}`
                      : `one time`}
                  </p>
                  <MotionButton
                    loading={loading[i.id]}
                    disabled={loading[i.id] || (hasValidStripeSubscription && subscriptionId && subscriptionId?.filter((sub) => sub !== (i.product as {id : string}).id).length > 0)}
                    //@ts-ignore
                    tooltip={ (hasValidStripeSubscription && subscriptionId && subscriptionId?.filter((sub) => sub !== i.product.id).length > 0) ? <div>You already have this subscription</div> : undefined}
                    onClick={async () => {
                      if (!isSignedIn) {
                        router.push(`/sign-in?afterlogin=${router.asPath}`);
                      }
                      if (user && user.publicMetadata.role != "parent") {
                        return addAlert("error", "You're not sign in with a parent account", 3000);
                      }
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
                            5000
                          );
                        }
                      });
                    } }
                    className=" mx-auto mt-5 rounded-md bg-indigo-500 px-3 py-1 text-white"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                  >
                      {i.type == "recurring" ? `Subscribe` : "Pay"}
                  </MotionButton>
                </Card>
              );
            })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
