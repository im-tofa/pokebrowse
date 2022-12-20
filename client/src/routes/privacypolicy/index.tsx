import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useEffect } from "preact/hooks";
import style from "./style.css";

const PrivacyPolicy: FunctionalComponent = () => {
  useEffect(() => {
    document.title = "Privacy | Pokebrowse";
  }, []);
  return (
    <div style="padding: 0 1em 0 1em; overflow-y: scroll">
      <h1>Privacy Policy</h1>
      <p>
        This privacy policy will explain how Pokebrowse uses the personal data
        we collect from you when you use our website.
      </p>
      <p>
        <ul>
          <li>What data do we collect?</li>
          <li>How do we collect your data?</li>
          <li>How will we use your data?</li>
          <li>How do we store your data?</li>
          <li>What are your data protection rights?</li>
          <li>What are cookies?</li>
          <li>How do we use cookies?</li>
          <li>What types of cookies do we use?</li>
          <li>How to manage your cookies</li>
          <li>Changes to our privacy policy</li>
          <li>How to contact us</li>
        </ul>
      </p>
      <h2>What data do we collect?</h2>
      <p>
        Pokebrowse collects the following data:
        <ul>
          <li>IP address</li>
          <li>
            If you register an account: Personal identification information
            (username, e-mail)
          </li>
          <li>If you upload sets: Uploaded Pokémon sets</li>
        </ul>
      </p>
      <h2>How do we collect your data?</h2>
      <p>
        You directly provide Pokebrowse with most of the data we collect. We
        collect data and process data when you:
        <ul>
          <li>Register an account</li>
          <li>Upload Pokémon sets</li>
          <li>Browse Pokémon sets or otherwise interact with the service</li>
        </ul>
      </p>
      <h2>How will we use your data?</h2>
      <p>
        Pokebrowse collects your data so that we can:
        <ul>
          <li>Persist Pokémon sets so they can be browsed by others</li>
          <li>Allow users to create accounts and upload Pokémon sets</li>
          <li>
            Mitigate abuse of the service. Your email is not shared with other
            users.
          </li>
        </ul>
      </p>
      <h2>How do we store your data?</h2>
      <p>
        Pokebrowse securely stores your uploaded Pokémon sets in a database
        located in the EU. All communication with the database is encrypted.
        Your IP address is stored in-memory on a server for 7 days to mitigate
        abuse of the service. Once this time period has expired, your IP address
        is deleted from memory. If you create an account, your account
        information is securely stored in an EU-hosted database managed by Auth0
        on behalf of Pokebrowse. Your email is only used for signup purposes and
        resetting your password, and it is not shared with any other users.
      </p>
      <h2>What are your data protection rights?</h2>
      <p>
        Pokebrowse would like to make sure you are fully aware of all of your
        data protection rights. Every user is entitled to the following:
        <ul>
          <li>
            The right to access – You have the right to request Pokebrowse for
            copies of your personal data.
          </li>
          <li>
            The right to rectification – You have the right to request that
            Pokebrowse correct any information you believe is inaccurate. You
            also have the right to request Pokebrowse to complete the
            information you believe is incomplete.{" "}
          </li>
          <li>
            The right to erasure – You have the right to request that Pokebrowse
            erase your personal data, under certain conditions.{" "}
          </li>
          <li>
            The right to restrict processing – You have the right to request
            that Pokebrowse restrict the processing of your personal data, under
            certain conditions.
          </li>
          <li>
            The right to object to processing – You have the right to object to
            Pokebrowse's processing of your personal data, under certain
            conditions.{" "}
          </li>
          <li>
            The right to data portability – You have the right to request that
            Pokebrowse transfer the data that we have collected to another
            organization, or directly to you, under certain conditions.
          </li>
        </ul>
        If you make a request, we have one month to respond to you. If you would
        like to exercise any of these rights, please contact us by messaging
        'utofa' on Smogon.
      </p>
      <h2>Cookies</h2>
      <p>
        Cookies are text files placed on your computer to collect standard
        Internet log information and visitor behavior information. When you
        visit our websites, we may collect information from you automatically
        through cookies or similar technology For further information, visit
        allaboutcookies.org.
      </p>
      <h2>How do we use cookies?</h2>
      <p>
        Pokebrowse uses cookies only when you are signed in, in order to allow
        sign-in functionality and provide quality-of-life features such as
        keeping you signed in.
      </p>
      <h2>How to manage cookies</h2>{" "}
      <p>
        You can set your browser not to accept cookies, and the above website
        tells you how to remove cookies from your browser. However, in a few
        cases, some of our website features may not function as a result.
      </p>
      <h2>Changes to our privacy policy</h2>
      <p>
        Pokebrowse keeps its privacy policy under regular review and places any
        updates on this web page. This privacy policy was last updated on 20
        December 2022.
      </p>
      <h2>How to contact us</h2>
      <p>
        If you have any questions about Pokebrowse's privacy policy, the data we
        hold on you, or you would like to exercise one of your data protection
        rights, please do not hesitate to contact us by messaging 'utofa' on
        Smogon.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
