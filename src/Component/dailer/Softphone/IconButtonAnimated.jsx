// /src/Component/dailer/Softphone/IconButtonAnimated.js


import { motion } from 'framer-motion';
import { IconButton } from '@mui/material';

export default function IconButtonAnimated(props) {
  return (
    <motion.div whileTap={{ scale: 0.9 }} transition={{ type:'spring', stiffness:300, damping:20 }}>
      <IconButton color="primary" {...props}/>
    </motion.div>
  );
}
