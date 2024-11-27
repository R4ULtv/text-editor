import { AvailableAiCheck } from "@/components/help/AvailableAiCheck";
import { CodeCopy } from "@/components/help/CodeCopy";
import { CheckItem } from "@/components/help/CheckItem";
import { GeminiIcon } from "@/utils/icons";

export const metadata = {
  title: "Enable AI Feature Flags in Chrome",
  description:
    "Step-by-step guide to enable experimental AI features in Chrome using feature flags and download required components.",
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 text-start mb-3 flex items-center gap-2">
        <GeminiIcon className="size-10" /> How to Enable AI Feature Flags in
        Chrome
      </h1>

      <div className="mb-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          <span className="font-bold">Prerequisites:</span> You must be using
          Chrome version <CodeCopy text="133.0.6848.0" /> or higher.
        </p>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
          You can check your version at <CodeCopy text="chrome://version" />
        </p>
      </div>

      <ol className="space-y-6">
        <li className="flex items-start">
          <CheckItem number={1} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Enable On-Device Model Flag
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              This flag is necessary to enable so chrome can download Google's
              Gemini model to run directly in your browser
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Enable this core feature flag and set to ("Enabled
              BypassPerfRequirement"):
            </p>
            <ul className="mt-2 list-disc list-inside text-zinc-800 dark:text-zinc-200">
              <li>
                <CodeCopy text="chrome://flags/#optimization-guide-on-device-model" />
              </li>
            </ul>
          </div>
        </li>
        <li className="flex items-start">
          <CheckItem number={2} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Enable Features General AI Flags
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Activate the following feature flags: (activate all for access to
              the full set of features)
            </p>
            <ul className="mt-2 list-disc list-inside text-zinc-800 dark:text-zinc-200 space-y-2">
              <li>
                General:{" "}
                <CodeCopy text="chrome://flags/#prompt-api-for-gemini-nano" />
              </li>
              <li>
                Summarization:{" "}
                <CodeCopy text="chrome://flags/#summarization-api-for-gemini-nano" />
              </li>
              <li>
                Writing:{" "}
                <CodeCopy text="chrome://flags/#writer-api-for-gemini-nano" />
              </li>
              <li>
                Rewriting:{" "}
                <CodeCopy text="chrome://flags/#rewriter-api-for-gemini-nano" />
              </li>
            </ul>
          </div>
        </li>

        <li className="flex items-start">
          <CheckItem number={3} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Enable Language Features Flags
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Activate these language-related feature flags:
            </p>
            <ul className="mt-2 list-disc list-inside text-zinc-800 dark:text-zinc-200 space-y-2">
              <li>
                Language Detection:{" "}
                <CodeCopy text="chrome://flags/#language-detection-api" />
              </li>
              <li>
                Translation ("Enabled without language pack limit"):{" "}
                <CodeCopy text="chrome://flags/#translation-api" />
              </li>
            </ul>
          </div>
        </li>

        <li className="flex items-start">
          <CheckItem number={4} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Restart Chrome
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Click the "Relaunch" button that appears at the bottom of the
              screen to apply changes
            </p>
          </div>
        </li>
      </ol>

      <div className="my-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          Note: These features are experimental and may not be stable. Enable at
          your own risk.
        </p>
      </div>

      <div className="my-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center gap-2">
        <p className="text-sm text-zinc-800 dark:text-zinc-200">
          After restarting, check if the AI features are available:
        </p>
        <AvailableAiCheck />
      </div>
      <ol className="space-y-6">
        <li className="flex items-start">
          <CheckItem number={5} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Install AI Components
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Wait for Chrome to download and install the necessary AI
              components. This may take a few minutes.
            </p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckItem number={6} />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Install Translation Languages
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              You can install translation languages in one of two ways:
            </p>
            <ul className="mt-2 list-disc list-inside text-zinc-800 dark:text-zinc-200 space-y-2">
              <li>
                Visit the translation internals page:{" "}
                <CodeCopy text="chrome://on-device-translation-internals" />
              </li>
              <li>
                Or simply attempt to translate text in a new language - Chrome
                will automatically download the required language pack but you
                probably need some time to download.
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  );
}
