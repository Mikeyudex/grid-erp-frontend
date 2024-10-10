import { styled } from "@stitches/react";
import * as Form from '@radix-ui/react-form';

export const StyledForm = styled(Form.Root, {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
});


export const StyledField = styled(Form.Field, {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

export const StyledInput = styled(Form.Control, {
    all: 'unset',
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 10px',
    height: 35,
    fontSize: 15,
    lineHeight: 1,
    color: 'black',
    backgroundColor: 'white',
    boxShadow: '0 0 0 1px gainsboro',
    '&:focus': { boxShadow: '0 0 0 2px dodgerblue' },
});

export const StyledLabel = styled(Form.Label, {
    fontSize: 15,
    fontWeight: 500,
    color: 'black',
});

export const StyledMessage = styled(Form.Message, {
    fontSize: 13,
    color: 'red',
    opacity: 0.8,
});

export const StyledButton = styled('button', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 500,
    height: 35,
    width: '98%',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': { backgroundColor: 'dimgray' },
    '&:focus': { boxShadow: '0 0 0 2px dodgerblue' },
});

