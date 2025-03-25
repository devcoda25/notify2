import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ variant = "contained", color = "primary",icon, onClick, children,endicon,sx={} }) => {
    const customStyles = {
        contained: {    
            color:" white",
            padding:"8px 16px",
            border:" #006bff",
            borderRadius:"40px",
            background:" #006bff",
            width:"150px",
            minHeight: "44px",
            boxShadow: "none",
            marginLeft:"auto",
            textTransform:"capitalize" },
           
        outlined: { 
            border: "1px solid #476788",
            color:" #0a2540",
            borderRadius:"22px",
            textTransform:"capitalize",
            padding:"8px 16px",
        },

        text: { color: "black", textTransform: "capitalize" },
    };

    return (
        <Button 
            variant={variant} 
            color={color} 
            onClick={onClick} 
            sx={{...customStyles[variant],...sx}}
            startIcon={icon} 
            endIcon={endicon}



        >
            {children}
        </Button>
    );
};

export default CustomButton;
