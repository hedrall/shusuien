export type Step = 'first' | 'inputPassword' | 'noAccount' | 'registerNewAccount' | 'setUserName';
export type StepProps = {
  setStep: (nextStep: Step, email: string) => void;
  email: string;
};
