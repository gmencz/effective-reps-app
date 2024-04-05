import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Generate authentication options for browser

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  return json({});
}

export default function SignIn() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      setIsAvailable(available);
    };

    checkAvailability();
  }, []);

  return (
    <Fragment>
      {isAvailable ? (
        <form method="POST">
          <input type="email" id="email" name="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      ) : isAvailable === null ? (
        <p>Checking availability...</p>
      ) : (
        <p>Sorry, WebAuthN is not available.</p>
      )}
    </Fragment>
  );
}
