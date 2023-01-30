import React, { useState } from 'react';
import cn from 'classnames';
import 'firebaseui/dist/firebaseui.css';
import { FirstStep } from '@frontend/components/pages/Login/steps/firstStep';
import { Step, StepProps } from '@frontend/components/pages/Login/steps/common';
import { NoAccountStep } from '@frontend/components/pages/Login/steps/noAccount';
import { SetUserNameStep } from '@frontend/components/pages/Login/steps/setUserName';
import { RegisterNewAccountStep } from '@frontend/components/pages/Login/steps/registerNewAccount';
import { InputPasswordStep } from '@frontend/components/pages/Login/steps/inputPassword';

export type LoginPageProps = {
  className?: string;
};

const steps: { [Key in Step]: React.FC<StepProps> } = {
  first: FirstStep,
  inputPassword: InputPasswordStep,
  noAccount: NoAccountStep,
  registerNewAccount: RegisterNewAccountStep,
  setUserName: SetUserNameStep,
};

export const LoginPage: React.FC<LoginPageProps> = props => {
  const { className } = props;

  const [state, setState] = useState<{ step: Step; email: string }>({
    step: 'first',
    email: '',
  });
  const Component = steps[state.step];

  const setStepHandler = (step: Step, email: string) => {
    setState({ step, email });
  };

  return (
    <div className={cn('LoginPage', className)}>
      <div className="Content">
        <h2>ログイン</h2>
        <Component setStep={setStepHandler} email={state.email} />
      </div>
    </div>
  );
};
