import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { pageview } from 'react-ga';
import { Button, TextInput, Title, WhiteCard } from '@examsecure/design-system';
import styled from 'styled-components';
import backgroundImg from '../../static/authbg1.jpg';
import { Link } from 'react-router-dom';
import colors from '@examsecure/design-system/src/colors';

const AuthContainer = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${backgroundImg}) center bottom;
  flex: 1;
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
  padding: 18px 0;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const HelperText = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 15px;
  color: ${colors.grayText};
  padding: 15px 0;
`;

const SignIn = ({ isSignedIn, authState, setAuthState, setLoading }) => {
  const [email, setEmail] = useState('javabipe@gmail.com');
  const [pwd, setPwd] = useState('bipe8751');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [stage, setStage] = useState(0); // 0 for sign in, 1 for forget password, 2 for verification

  const onBlur = () => {};

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = await Auth.signIn(email, pwd);
      setAuthState(user);
      setLoading(false);
      console.log(user);
    } catch (e) {
      setLoading(false);
      alert(e.message);
      console.log(e);
    }
  };

  useEffect(() => {
    pageview(window.location.pathname + window.location.search);
  }, []);

  const handleForgotPwdSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await Auth.forgotPassword(email);
      console.log(res);
      setStage(2);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert(e.message);
      console.log(e);
    }
  };

  const handleForgotPwdVerify = async (e) => {
    e.preventDefault();
    if (pwd !== confirmPwd) {
      alert('As senhas não coincidem');
    } else if (pwd.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres');
    } else {
      try {
        setLoading(true);
        const res = await Auth.forgotPasswordSubmit(
          email,
          verificationCode,
          pwd,
        );
        console.log(res);
        setStage(0);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        alert(e.message);
        console.log(e);
      }
    }
  };

  return (
    <>
      {isSignedIn ? (
        <>{window.location.assign("https://ensinoseguro.com.br/selectQuestionSet")}</>
      ) : (
        <>
          <AuthContainer>
            <StyledWhiteCard>
              <FlexLeft>
                <Title value={'Entrar como Aluno'} />
                <HelperText>
                  <div style={{ paddingBottom: '20px', paddingTop: '16px' }}>
                    Para um test drive da plataforma, basta clicar em Entrar com
                    credenciais pré-preenchidas.
                  </div>
                </HelperText>
                <div>
                  <div>
                    <Link to={'/signup'}>
                      Não tem uma conta? Crie uma.
                    </Link>
                  </div>
                  <div>
                    {stage === 0 ? (
                      <a href={'#'} onClick={() => setStage(1)}>
                        Esqueceu Senha?
                      </a>
                    ) : (
                      <a href={'#'} onClick={() => setStage(0)}>
                        Voltar para Entrar.
                      </a>
                    )}
                  </div>
                </div>
              </FlexLeft>
              <FlexRight>
                {stage === 0 ? (
                  <form onSubmit={handleSignIn}>
                    <InputsContainer>
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
                    </InputsContainer>
                    <ButtonContainer>
                      <Button
                        variant={'primary'}
                        label={'Entrar'}
                        type={'submit'}
                        width={'150px'}
                      />
                    </ButtonContainer>
                  </form>
                ) : (
                  <>
                    {stage === 1 ? (
                      <form onSubmit={handleForgotPwdSubmit}>
                        <InputsContainer>
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
                    ) : (
                      <form onSubmit={handleForgotPwdVerify}>
                        <InputsContainer>
                          <HelperText>
                            <div>
                              Insira o código de seis dígitos enviado por e-mail
                            </div>
                          </HelperText>
                          <TextInputContainer>
                            <TextInput
                              label={'Código de Verificação'}
                              onBlur={onBlur}
                              onChange={(verificationCode) => {
                                setVerificationCode(verificationCode);
                              }}
                              iconLeft={'Hash'}
                              value={verificationCode}
                              type={'number'}
                              name={'verificationCode'}
                              required={true}
                            />
                          </TextInputContainer>
                          <TextInputContainer>
                            <TextInput
                              label={'Nova Senha'}
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
                              label={'Confirme a Nova Senha'}
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
                            label={'Enviar'}
                            type={'submit'}
                            width={'150px'}
                          />
                        </ButtonContainer>
                      </form>
                    )}
                  </>
                )}
              </FlexRight>
            </StyledWhiteCard>
          </AuthContainer>
        </>
      )}
    </>
  );
};

export default SignIn;
