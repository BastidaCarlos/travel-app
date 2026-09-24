import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../../services/authServices";
import { toaster } from "../../components/ui/toaster";
import Logo from "../../assets/Logo.svg"
import { 
    Box,
    Button,
    Card,
    Field,
    HStack,
    Image,
    Input,
    InputGroup,
    VStack
} from "@chakra-ui/react";
import { LockKeyhole } from "lucide-react";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [ password, setPassword ] = useState(''); 
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ loading, setLoading ] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
           toaster.create({
            title: 'Error',
            description: 'The password do not match',
            type: 'error',
           }) 
           return;
        }

        if (!token) {
            toaster.create({
                title: "Token not found",
                description: 'Invalid recovery link',
                type: 'error',
            })
            return;
        }

        setLoading(true);

        try {
            await resetPassword({ token, password })

            toaster.create({
                title: 'Password updated',
                description: 'You can log in with your new password',
                type: 'success',
            })

            navigate('/login');
        } catch (error) {
            toaster.create({
                title: 'Error',
                description: error.response?.data?.error || 'Invalid recovery link',
                type: 'error',
            })
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <VStack
            w='100vw'
            h='100vh'
            justifyContent="center"
            maxW={{ base: '90%', lg: '600px', xl: '900px'}}
            mx="auto"
        >
            <Card.Root
                w="full"
                mx="auto"
            >
                <Card.Header textAlign="center">
                    <VStack>
                        <Image 
                            src={Logo}
                            boxSize="80px"
                            alt="Adventure Path Logo"
                        />
                        <Card.Title>
                            Reset Password
                        </Card.Title>
                    </VStack>
                </Card.Header>
                <Card.Body>
                    <Box as="form" onSubmit={handleSubmit}>
                        <VStack>
                            <Field.Root>
                                <Field.Label htmlFor="password">
                                    Password
                                </Field.Label>
                                <InputGroup startElement={<LockKeyhole />}>
                                    <Input 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        name="password"
                                        id="password"
                                        variant="subtle"
                                        placeholder="********"
                                    />
                                </InputGroup>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Field.Label>
                                <InputGroup startElement={<LockKeyhole />}>
                                    <Input 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        variant="subtle"
                                        placeholder="********"
                                    />
                                </InputGroup>
                            </Field.Root>
                            <HStack
                                w="full"
                                justify="flex-start"
                            >
                                <Button
                                    type="submit"
                                    colorPalette='teal'
                                    disabled={loading}
                                >
                                    Update Password
                                </Button>
                                <Button
                                    variant="outline"
                                    colorPalette="red"
                                    onClick={() => navigate('/login')}
                                    disabled={loading}
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

export default ResetPassword;