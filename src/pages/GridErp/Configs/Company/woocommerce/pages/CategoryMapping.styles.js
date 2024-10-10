import { styled } from '@mui/system';
import { SelectItem, SelectTrigger, SelectContent, SelectViewport } from '@radix-ui/react-select';
import { Paper } from '@mui/material';

// Estilos personalizados usando styled-components
export const Container = styled('div')({
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
});

export const MappingContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    maxHeight: '62vh',
    overflowY: 'auto',
}));

export const ColumnHeaders = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
});

export const MappingRow = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
});

export const Column = styled('div')({
    flex: 1,
});

// Estilos para los componentes de Radix UI
export const StyledTrigger = styled(SelectTrigger)(({ theme }) => ({
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 13,
    lineHeight: 1,
    height: 35,
    gap: 5,
    backgroundColor: 'white',
    color: theme.palette.text.primary,
    boxShadow: `0 2px 10px ${theme.palette.mode === 'dark' ? 'black' : 'rgba(0,0,0,0.1)'}`,
    '&:hover': { backgroundColor: theme.palette.action.hover },
    '&:focus': { boxShadow: `0 0 0 2px ${theme.palette.primary.main}` },
    '&[data-placeholder]': { color: theme.palette.text.secondary },
    width: '90%',
}));

export const StyledContent = styled(SelectContent)(({ theme }) => ({
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
    boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
}));

export const StyledViewport = styled(SelectViewport)({
    padding: 5,
});

export const StyledItem = styled(SelectItem)(({ theme }) => ({
    fontSize: 13,
    lineHeight: 1,
    color: theme.palette.text.primary,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    padding: '0 35px 0 25px',
    position: 'relative',
    userSelect: 'none',
    '&[data-highlighted]': {
        outline: 'none',
        backgroundColor: theme.palette?.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));
