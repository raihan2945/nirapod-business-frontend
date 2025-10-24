'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#2563eb"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default ProgressBarProvider;