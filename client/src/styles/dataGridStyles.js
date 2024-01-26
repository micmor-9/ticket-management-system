import {tokens} from "../theme";

export const dataGridStyles = (theme) => {
    const colors = tokens(theme.palette.mode);
    return {
        "& .MuiDataGrid-root": {
            border: "none",
        },
        "& .name-column--cell": {
            color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
        },
        "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
        },
        "& .MuiCircularProgress-root": {
            color: colors.greenAccent[700],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100],
        },
        "& .MuiDataGrid-row": {
            cursor: "pointer",
        },
    };
};
