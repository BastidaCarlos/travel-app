import { useState } from "react";
import { useNavigate } from "react-router";
import { forgotPassword } from "../../services/authServices";
import { 
    Alert,
    Box,
    Button,
    Card,
    Field,
    InputGroup,
    Input,
    VStack,
    HStack,
} from "@chakra-ui/react";
import { Mail, Send } from "lucide-react";

function ForgotPassword() {
    const [ email, setEmail ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ error, setError ] = useState('')
    const [ isSend, setIsSend ] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('');
        setIsSend(false);
        
       try {
        
        if (!email) {
            setError('Email is required')
            return;
        } 

        setIsSubmitting(true)
        
        await forgotPassword({ email });
        setIsSend(true)

       } catch (error) {
        setError('An error occurred')
       } finally {
        setIsSubmitting(false)
       }
    }
    
    return (
        <VStack
            w="100vw"
            h="100vh"
            alignContent="center"
            justifyContent="center"
            maxW={{ base: '90%', lg: '600px', xl: '900px'}}
            mx="auto"
        >
            <Card.Root
                w="full"
                mx="auto"
            >
                <Card.Header textAlign="center">
                    <Card.Title>Forgot Password</Card.Title>
                    <Card.Description>
                        Enter your email address to receive a password recovery email
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Box as='form' onSubmit={handleSubmit}>
                        <VStack>
                            <Field.Root>
                                <Field.Label htmlFor="email">
                                    Email:
                                </Field.Label>
                                <InputGroup startElement={<Mail />}>
                                    <Input 
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="subtle"
                                        placeholder="you@example.com"
                                        color="black"
                                    />
                                </InputGroup>
                            </Field.Root>
                            {error && (
                                <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Title>{error}</Alert.Title>
                                </Alert.Root>
                            )}
                            {isSend && (
                                <Alert.Root status="success">
                                    <Alert.Indicator />
                                    <Alert.Title>If an account with that email exists, you'll receive a password reset link shortly</Alert.Title>
                                </Alert.Root>
                            )}
                            <HStack
                                w="full"
                                justify="flex-start"
                            >
                                <Button
                                    type="submit"
                                    colorPalette='teal'
                                    disabled={isSubmitting}
                                >
                                    <Send /> Recovery Password
                                </Button>
                                <Button
                                    variant="outline"
                                    colorPalette="red"
                                    onClick={() => navigate('/login')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </Card.Body>
            </Card.Root>
        </VStack>
    )
}

export default ForgotPassword;