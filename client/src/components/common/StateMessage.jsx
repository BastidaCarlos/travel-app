import { Icon, EmptyState, Button } from "@chakra-ui/react"
import { SearchX, RefreshCcw } from "lucide-react"

export const StateMessage = ({
    title = "Not results",
    description,
    icon = <SearchX />,
    colorPalette = "gray",
    onRetry,
    retryText = "Try Again",
    children,
}) => {
    return (
        <EmptyState.Root textAlign="center" colorPalette={colorPalette}>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <Icon color={`${colorPalette}.500`}>
                        {icon}
                    </Icon>
                </EmptyState.Indicator>
                <EmptyState.Title>{title}</EmptyState.Title>
                {description && (
                    <EmptyState.Description>{description}</EmptyState.Description>
                )}

                {onRetry && (
                    <Button
                        colorPalette="teal"
                        variant="outline"
                        size="sm"
                        mt={3}
                        onClick={onRetry}
                    >
                        <RefreshCcw />
                        {retryText}
                    </Button>
                )}

                {children}
            </EmptyState.Content>
        </EmptyState.Root>
    )
}