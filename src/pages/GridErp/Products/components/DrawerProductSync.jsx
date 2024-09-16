import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import iconWoo from '../../../../icon-woo.png';
import iconMeli from '../../../../meli-logo.png';
import { Checkbox } from '@mui/material';

export function DrawerProductSync({ openDrawerSync, setOpenDrawerSync }) {

    const [checked, setChecked] = React.useState([0]);

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpenDrawerSync(open);
    };

    const handleToggleChecked = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    }

    const options = [
        {
            title: <h5>Woocommerce</h5>,
            icon: <img src={iconWoo} height={48} width={48}></img>
        },
        {
            title: <h5>Mercado libre</h5>,
            icon: <img src={iconMeli} height={48} width={48}></img>
        }
    ]

    const Puller = styled('div')(({ theme }) => ({
        width: 50,
        height: 6,
        backgroundColor: grey[300],
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
        ...theme.applyStyles('dark', {
            backgroundColor: grey[900],
        }),
    }));


    const listItems = () => (
        <Box
            sx={{
                width: 'auto',
                backgroundColor: 'white',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
            }}
            role="presentation"
           /*  onClick={toggleDrawer(false)} */
            onKeyDown={toggleDrawer(false)}
        >
            <Puller />
            <div className='px-3 py-3 mt-2'>
                <h5>Donde te gustaría sincronizar tu producto?</h5>
            </div>

            <List>
                {options.map((item, index) => {
                    const labelId = `checkbox-list-label-${index}`;
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton role={undefined} onClick={() => handleToggleChecked(index)} dense>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(index) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>

        </Box>
    );

    return (
        <div>
            <React.Fragment>
                {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
                <SwipeableDrawer
                    anchor={'bottom'}
                    open={openDrawerSync}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {listItems()}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
