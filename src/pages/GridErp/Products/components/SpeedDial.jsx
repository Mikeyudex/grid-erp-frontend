import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';

export default function SpeedDialProduct({
    actions
}) {

  return (
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'fixed', bottom: 16, right: 16, }}
        icon={<SpeedDialIcon style={{color:'white'}} openIcon={<EditIcon />} />}
        
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            sx={{color:'white'}}
            onClick={action?.onClick}
            className='speed-dial-product'
          />
        ))}
      </SpeedDial>
  );
}
