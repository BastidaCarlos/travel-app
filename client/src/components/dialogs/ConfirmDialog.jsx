import { 
    Button,
    CloseButton,
    Dialog,
    Portal, 
} from "@chakra-ui/react";
import { Trash } from "lucide-react";

export const ConfirmDialog = ({
    title = "Are you sure?",
    description = "This action cannot be undone",
    open = false,
    onConfirm,
    onClose,
    confirmText = "Delete",
    cancelText = "Cancel", 
    isLoading,
}) => {

    return(
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {description}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={isLoading} onClick={onClose}>{cancelText}</Button>
                            </Dialog.ActionTrigger>
                            <Button variant="solid" colorPalette="red" disabled={isLoading} onClick={onConfirm}><Trash /> {confirmText}</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}