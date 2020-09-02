import React from 'react';
import { SpinnerContainer, SpinnerOverlay } from './loadingSpinner.styles';

export const WithSpinner = WrappedComponent => {
    const Spinner = ({ isLoading, ...otherProps }) => {
        return isLoading ? (
        <SpinnerOverlay>
            <SpinnerContainer/>
            Please Wait...
        </SpinnerOverlay>
        ) : (
            <WrappedComponent {...otherProps}/>
        )
    };
    return Spinner;
}


export const SimpleSpinner = () => {
    return (
        <SpinnerOverlay>
            <SpinnerContainer/>
        </SpinnerOverlay>
    )
}
