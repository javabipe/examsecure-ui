import React, { useState } from 'react';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import backgroundImg from '../../static/authbg1.jpg';
import { Title, TextInput, Button, WhiteCard } from '@examsecure/design-system';
import colors from '@examsecure/design-system/src/colors';
import { Link, useHistory } from 'react-router-dom';

const AuthContainer = styled.div`
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${backgroundImg}) center bottom;
  background-size: cover;
  display: flex;
  align-content: center;
`;

const InputsContainer = styled.div`
  padding: 25px 10px;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const TextInputContainer = styled.div`
  padding: 15px 0;
`;

const StyledWhiteCard = styled(WhiteCard)`
  display: flex;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    width: 95%;
  }
`;

const FlexRight = styled.div`
  padding: 10px;
  margin: auto;
  flex: 1;
`;

const FlexLeft = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HelperText = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 15px;
  color: ${colors.grayText};
  padding: 15px 0;
`;

const SignUp = ({ setLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [stage, setStage] = useState(0); // 0 for sign up stage, 1 for verification stage
  const [verificationCode, setVerificationCode] = useState('');

  const history = useHistory();

  const onBlur = () => {};

  const handleSignUp = (e) => {
    e.preventDefault();
    if (pwd !== confirmPwd) {
      alert('As senhas não coincidem');
    } else if (pwd.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres');
    } else {
      setLoading(true);
      console.log(name, email, pwd, confirmPwd);
      Auth.signUp({
        username: email,
        password: pwd,
        attributes: { email, name },
        validationData: [],
      })
        .then((data) => {
          setLoading(false);
          setStage(1);
          console.log(data);
        })
        .catch((err) => {
          setLoading(false);
          alert(`Um erro ocorreu: ${err.message}`);
          console.log(err);
        });
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    Auth.confirmSignUp(email, verificationCode)
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        history.push('/signin');
      })
      .catch((err) => {
        console.log(err);
        alert(`Um erro ocorreu: ${err.message}`);
      });
  };

  return (
    <>
      <AuthContainer>
        <StyledWhiteCard>
          <FlexLeft>
            <Title value={'Inscreva-se como Aluno'} />
            <HelperText>
              <div>
                Inscreva-se para obter uma conta gratuita de Aluno para continuar.
              </div>
            </HelperText>
            <HelperText>
              <Link to={'/signin'}>Já tem uma conta? Entrar.</Link>
            </HelperText>
          </FlexLeft>
          <FlexRight>
            {stage === 0 ? (
              <form onSubmit={handleSignUp}>
                <InputsContainer>
                  <TextInputContainer>
                    <TextInput
                      label={'Nome'}
                      onBlur={onBlur}
                      onChange={(name) => {
                        setName(name);
                      }}
                      iconLeft={'User'}
                      value={name}
                      type={'text'}
                      name={'name'}
                      required={true}
                    />
                  </TextInputContainer>
                  <TextInputContainer>
                    <TextInput
                      label={'Email'}
                      onBlur={onBlur}
                      onChange={(email) => {
                        setEmail(email);
                      }}
                      iconLeft={'Mail'}
                      value={email}
                      type={'email'}
                      name={'email'}
                      required={true}
                    />
                  </TextInputContainer>
                  <TextInputContainer>
                    <TextInput
                      label={'Senha'}
                      onBlur={onBlur}
                      onChange={(pwd) => {
                        setPwd(pwd);
                      }}
                      iconLeft={'Lock'}
                      value={pwd}
                      type={'password'}
                      name={'password'}
                      required={true}
                    />
                  </TextInputContainer>
                  <TextInputContainer>
                    <TextInput
                      label={'Confirme a Senha'}
                      onBlur={onBlur}
                      onChange={(pwd) => {
                        setConfirmPwd(pwd);
                      }}
                      iconLeft={'Lock'}
                      value={confirmPwd}
                      type={'password'}
                      name={'confirmPassword'}
                      required={true}
                    />
                  </TextInputContainer>
                </InputsContainer>
                <ButtonContainer>
                  <Button
                    variant={'primary'}
                    label={'Inscrever'}
                    type={'submit'}
                    width={'150px'}
                  />
                </ButtonContainer>
              </form>
            ) : (
              <form onSubmit={handleVerificationSubmit}>
                <HelperText>
                  <div>Insira o código de seis dígitos enviado para "{email}"</div>
                </HelperText>
                <InputsContainer>
                  <TextInputContainer>
                    <TextInput
                      label={'Código de Verificação'}
                      onBlur={onBlur}
                      onChange={(code) => {
                        setVerificationCode(code);
                      }}
                      iconLeft={'Hash'}
                      value={verificationCode}
                      type={'number'}
                      name={'verificationCode'}
                      required={true}
                    />
                  </TextInputContainer>
                </InputsContainer>
                <ButtonContainer>
                  <Button
                    variant={'primary'}
                    label={'Enviar'}
                    type={'submit'}
                    width={'150px'}
                  />
                </ButtonContainer>
              </form>
            )}
          </FlexRight>
        </StyledWhiteCard>
      </AuthContainer>
    </>
  );
};

export default SignUp;
