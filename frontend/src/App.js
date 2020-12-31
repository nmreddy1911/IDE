import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-dracula";
import "./App.css";
import "./components/Nav";
import Nav from "./components/Nav";
import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  Textarea,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuItemOption,
  MenuList,
  Alert,
  Link,
  Code,
  VStack,
  CircularProgress,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { runHelper } from "./helper/runHelper";
import { BiLink, BiRun, BiSave } from "react-icons/bi";
import { MdInput } from "react-icons/md";
import { VscOutput } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "./store/code/code";

//ACE-Editor Settings and API Settings
const languages = ["c", "c++", "java", "python"];
const choice = [6, 7, 4, 24];
const compilerArgs = [
  "-Wall -std=gnu99 -O2 -o a.out source_file.c",
  "-Wall -std=c++14 -O2 -o a.out source_file.cpp",
  "",
  "",
];
const templateCode = [
  `#include <stdio.h>

int main()
{
    printf("Hello");
    return 0;
}`,
  `#include <bits/stdc++.h>
using namespace std;
#define FASTIO                    \\
ios_base::sync_with_stdio(false); \\
cin.tie(0);                       \\
cout.tie(0);

int main()
{
    FASTIO;
    //------------------
    cout<<"Hello\\n";
    //--------------------
    return 0;
}`,
  `//'main' method must be in a class 'Rextester'.
//openjdk version '11.0.5'

import java.util.*;
import java.lang.*;

class Rextester
{  
    public static void main(String args[])
    {
        System.out.println("Hello, World!");
    }
}`,
  `print("Python is the Best")`,
];

languages.forEach((lang) => {
  if (lang === "c" || lang === "c++") lang = "c_cpp";
  require(`ace-builds/src-noconflict/mode-${lang}`);
});

//-------------------------------------------------------------------------------

function App({ entry = 0 }) {
  const codeGlobal = useSelector((state) => state.code);
  const dispatch = useDispatch();
  const toast = useToast();

  //STATES
  const [Language, setLanguage] = useState(codeGlobal.language);
  const [Mode, setMode] = useState("python");
  const [Choice, setChoice] = useState(24);
  const [Output, setOutput] = useState("Run To Generate Output");
  const [Pro, setPro] = useState(codeGlobal.code);
  const [Input, setInput] = useState("");
  const [CArgs, setCArgs] = useState("");
  const [Status, setStatus] = useState();
  const [Stats, setStats] = useState();
  const [Loading, setLoading] = useState(false);
  const [Warn, setWarn] = useState(false);
  //-----------------------------

  useEffect(() => {
    if (entry === 0) {
      let localValues = loadStorage();
      if (localValues !== undefined) {
        setLanguage(localValues[0]);
        setPro(localValues[1]);
        let index = languages.indexOf(localValues[0]);
        setCArgs(compilerArgs[index]);
        setChoice(choice[index]);
        if (index === 0 || index === 1) {
          setMode("c_cpp");
        } else {
          setMode(localValues[0]);
        }
      }
    }
    //eslint-disable-next-line
  }, [Loading]);

  useEffect(() => {
    dispatch(updateCode({ language: Language, code: Pro }));
    console.log(codeGlobal);
    setLoading(true);
    let code = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("code")) {
        code = JSON.parse(localStorage.getItem("code"));
        code = [];
      }
      code.push(Language);
      code.push(Pro);
      localStorage.setItem("code", JSON.stringify(code));
    }
    setLoading(false);
    //eslint-disable-next-line
  }, [Pro, Language]);

  const loadStorage = () => {
    if (typeof window !== undefined) {
      if (localStorage.getItem("code")) {
        return JSON.parse(localStorage.getItem("code"));
      } else {
        let code = ["python", ""];
        localStorage.setItem("code", JSON.stringify(code));
      }
    }
  };

  async function onChange(newValue) {
    await setPro(newValue);
  }

  var runArgs = {
    LanguageChoice: String(Choice),
    Program: Pro,
    Input: Input,
    CompilerArgs: CArgs,
  };

  const save = () => {
    dispatch(updateCode({ language: Language, code: Pro }));
    console.log(codeGlobal);
    setLoading(true);
    let code = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("code")) {
        code = JSON.parse(localStorage.getItem("code"));
        code = [];
      }
      code.push(Language);
      code.push(Pro);
      localStorage.setItem("code", JSON.stringify(code));
    }
    setLoading(false);
  };
  const run = () => {
    dispatch(updateCode({ language: Language, code: Pro }));
    setLoading(true);
    let code = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("code")) {
        code = JSON.parse(localStorage.getItem("code"));
        code = [];
      }
      code.push(Language);
      code.push(Pro);
      localStorage.setItem("code", JSON.stringify(code));
    }
    setOutput("running...");
    runHelper(runArgs)
      .then((data) => {
        if (data.Errors !== null) {
          setOutput("Errors:\n" + data.Errors);
          setStatus("error");
          setStats(data.Stats);
        } else if (data.Warnings && data.Result) {
          setOutput(data.Result + "\n \nWarnings:\n" + data.Warnings);
          setStatus("warning");
          setStats(data.Stats);
        } else if (data.Result) {
          setStatus("success");
          setOutput(data.Result);
          setStats(data.Stats);
        } else if (data.Warnings) {
          setOutput("Warnings:" + data.Warnings);
          setStatus("warning");
          setStats(data.Stats);
        } else {
          setOutput("Please try again");
          if (data.Stats !== undefined) {
            setStatus("error");
            setStats(data.Stats);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const runAndLink = () => {
    dispatch(updateCode({ language: Language, code: Pro }));
    setLoading(true);
    let code = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("code")) {
        code = JSON.parse(localStorage.getItem("code"));
        code = [];
      }
      code.push(Language);
      code.push(Pro);
      localStorage.setItem("code", JSON.stringify(code));
    }
    setOutput("running...");
    runHelper(runArgs)
      .then((data) => {
        if (data.Errors !== null) {
          setOutput("Errors:\n" + data.Errors);
          setStatus("error");
          setStats(data.Stats);
        } else if (data.Warnings && data.Result) {
          setOutput(data.Result + "\n \nWarnings:\n" + data.Warnings);
          setStatus("warning");
          setStats(data.Stats);
        } else if (data.Result) {
          setStatus("success");
          setOutput(data.Result);
          setStats(data.Stats);
        } else if (data.Warnings) {
          setOutput("Warnings:" + data.Warnings);
          setStatus("warning");
          setStats(data.Stats);
        } else {
          setOutput("Please try again");
          if (data.Stats !== undefined) {
            setStatus("error");
            setStats(data.Stats);
          }
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const NewlineText = (props) => {
    const text = props.text;
    text.replace(" ", "\u00a0");
    return text
      .split("\n")
      .map((str) => <p style={{ whiteSpace: "pre-wrap" }}>{str}</p>);
  };

  const handleInput = (name) => (event) => {
    const value = event.target.value;
    setInput(value);
  };
  const showWarning = () => {
    toast({
      title: "Warning",
      description:
        "If you change the language, your code will be reset, even if saved locally. Please be sure!!",
      isClosable: true,
      status: "warning",
      duration: "4000",
      onCloseComplete: setWarn(false),
    });
  };
  return (
    <Box>
      <Nav />
      <Row style={{ maxWidth: "100%", margin: "auto", padding: "10px" }}>
        <Col xs="12" md="8" lg="8">
          <Grid templateColumns="repeat(3, 1fr)" gap={6} marginBottom="10px">
            <Box w="100%" h="10" />
            <Box w="100%" h="10">
              <Menu closeOnSelect={false}>
                <MenuButton
                  w="100%"
                  as={Button}
                  colorScheme="blue"
                  onClick={() => setWarn(!Warn)}
                >
                  {Language.charAt(0).toUpperCase() + Language.slice(1)}
                </MenuButton>
                <MenuList minWidth="240px">
                  <MenuOptionGroup defaultValue={Language} type="radio">
                    {languages.map((language, index) => (
                      <MenuItemOption
                        key={language}
                        value={language}
                        onClick={async () => {
                          setWarn(false);
                          if (language === "c" || language === "c++") {
                            setMode("c_cpp");
                          } else setMode(language);
                          setLanguage(language);
                          setChoice(choice[index]);
                          setPro(templateCode[index]);
                          setCArgs(compilerArgs[index]);
                        }}
                      >
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Box>
            <Box w="100%" h="10" />
          </Grid>
          <Center className="editor" maxW="100%">
            <AceEditor
              width="100%"
              fontSize="1rem"
              mode={Mode}
              theme="dracula"
              onChange={onChange}
              name="code"
              value={Pro}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 4,
                showPrintMargin: false,
              }}
              showGutter={true}
              highlightActiveLine={true}
            />
          </Center>
          <Box padding="20px">
            <HStack>
              <Button width="33%" size="lg" colorScheme="blue" onClick={save}>
                <Icon as={BiSave} w={6} h={6} />
                Save Locally
              </Button>
              <Button width="33%" size="lg" colorScheme="blue" onClick={run}>
                <Icon as={BiRun} w={6} h={6} />
                Run
              </Button>
              <Button width="33%" size="lg" colorScheme="blue">
                <Icon as={BiLink} w={6} h={6} />
                Run & Generate Link
              </Button>
            </HStack>
          </Box>
          <Alert></Alert>
        </Col>
        <Col xs="12" md="4">
          <VStack width="100%">
            <Box padding="20px" width="100%" minH="250px">
              <Heading size="sm" textAlign="center" paddingBottom="10px">
                <Icon as={MdInput} w={6} h={6} />
                INPUT
              </Heading>
              <Textarea
                size="md"
                resize="none"
                height="100%"
                placeholder="Enter your Input here"
                onChange={handleInput("Input")}
                value={Input}
              />
            </Box>
            {Loading && (
              <Box width="100%" marginTop="20px">
                <Center>
                  <CircularProgress isIndeterminate />
                </Center>
              </Box>
            )}
            <Box padding="20px" minH="250px" width="100%">
              <Heading size="sm" textAlign="center" paddingBottom="10px">
                <Icon as={VscOutput} w={6} h={6} />
                OUTPUT
              </Heading>
              <Container
                minHeight="230px"
                maxWidth="100%"
                borderWidth="1px"
                borderRadius="7px"
                borderColor="rgba(255, 255, 255, 0.16)"
                marginRight="0"
                marginLeft="0"
              >
                <NewlineText text={Output} />
              </Container>
            </Box>
            {Status && (
              <Box
                padding="20px"
                height="50px"
                width="100%"
                marginBottom="100px"
              >
                <Alert status={Status}>
                  <AlertIcon />
                  <AlertTitle>
                    {Status.charAt(0).toUpperCase() + Status.slice(1)}
                  </AlertTitle>
                  <AlertDescription>{Stats}</AlertDescription>
                </Alert>
              </Box>
            )}
          </VStack>
        </Col>
      </Row>
      <Alert
        justifyContent="center"
        textAlign="center"
        marginTop="10px"
        borderRadius="12px"
      >
        Made with ❤️️ by
        <Link marginLeft="6px" color="blue.300" href="https://nmreddy.ml">
          <Code colorScheme="blue" padding="5px">
            <Heading size="sm">Manish</Heading>
          </Code>
        </Link>
      </Alert>
      {Warn && showWarning()}
    </Box>
  );
}

export default App;
