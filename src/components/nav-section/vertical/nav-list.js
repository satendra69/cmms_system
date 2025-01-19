import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Collapse from '@mui/material/Collapse';
// routes
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';
//
import NavItem from './nav-item';

// ----------------------------------------------------------------------

export default function NavList({ data, depth, hasChild, config }) {
  const pathname = usePathname();

  //console.log("data_____menu",data);
  //console.log("depth_____menu",depth);
  //console.log("hasChild_____menu",hasChild);
  //console.log("config_____menu",config);

  
  const active = useActiveLink(data.path, hasChild);
   // console.log("active_____menu",active);
  const externalLink = data.path.includes('http');

  const [open, setOpen] = useState(active);

  // useEffect(() => {
  //   if (!active) {
  //     handleClose();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);
//console.log("open_____",open);
  const handleToggle = useCallback(() => {

    setOpen((prev) => !prev);
   
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onClick={handleToggle}
        config={config}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} config={config} />
        </Collapse>
      )}
    </>
  );
}

NavList.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
  
};

// ----------------------------------------------------------------------

function NavSubList({ data, depth, config, onToggle }) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
          config={config}
          
        />
      ))}
    </>
  );
}

NavSubList.propTypes = {
  config: PropTypes.object,
  data: PropTypes.array,
  depth: PropTypes.number,
 
};
