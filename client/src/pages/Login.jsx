import Header from "../components/Header";
import Footer from "../components/Footer";

import { 
    Flex,
    Box, 
    Button, 
    Heading 
} from "@chakra-ui/react";

function Login() {
    return(
        <Flex
            direction="column"
            minHeight="100vh"
        >

            <Header />

                <Box flex="1">
                    <Heading>Login Page</Heading>
                    <Button colorPalette={"teal"}>
                        Login
                    </Button>
                </Box>

            <Footer />

        </Flex>
    )
}

export default Login;