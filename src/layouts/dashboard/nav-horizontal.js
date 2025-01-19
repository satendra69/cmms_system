import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { NavSectionHorizontal } from 'src/components/nav-section';

//
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import { HeaderShadow } from '../_common';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <div className="menuHomeHorizontal">
      <AppBar
        component="nav"
        sx={{
          top: HEADER.H_DESKTOP_OFFSET,
        }}
      >
        <Toolbar
          sx={{
            ...bgBlur({
              color: theme.palette.background.default,
            }),
          }}
        >
          <div
            className="HorizontalView"
            style={{ overflowX: 'auto', whiteSpace: 'nowrap', maxHeight: '100%', width: '100%' }}
          >
            <NavSectionHorizontal
              data={navData}
              config={{
                currentRole: user?.role || 'admin',
              }}
            />
          </div>
        </Toolbar>
        <HeaderShadow />
      </AppBar>
    </div>
  );
}

export default memo(NavHorizontal);
