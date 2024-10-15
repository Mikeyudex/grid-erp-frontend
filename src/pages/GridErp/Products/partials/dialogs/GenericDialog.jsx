import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";

export const GenericDialog = ({ open, handleClose, title, body, icon, isCancelable, handleClick }) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={handleClose}>
            <AlertDialog.Trigger asChild>
                <button className={`${styles.Button} violet`}>{title}</button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={styles.Overlay} />
                <AlertDialog.Content className={styles.Content}>
                    <AlertDialog.Title className={styles.Title}>
                        {title}
                    </AlertDialog.Title>
                    <AlertDialog.Description className={styles.Description}>
                        {body}
                    </AlertDialog.Description>
                    <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                        {isCancelable && (
                            <AlertDialog.Cancel asChild>
                                <button className={`${styles.Button} violet`}>Cancelar</button>
                            </AlertDialog.Cancel>
                        )}
                        <AlertDialog.Action asChild>
                            <button
                                onClick={handleClick}
                                className={`${styles.Button} blue`}>
                                {icon}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

