import React,{useState,useRef,useEffect} from "react";
import ButtonComponent from "../../../ButtonComponent";
import VariablesDropdown from "./VariablesDropdown";
import style from "../../../MuiStyles/muiStyle";
import { ImageIcon,MovieIcon,AudiotrackIcon,DescriptionOutlinedIcon,DeleteOutlineIcon } from "../../../Icon";


const variables = [
    { title: "first_incoming_message", value: "@first_incoming_message" },

];
const contactAttributes = [
    { title: "actual_fare", value: '{{actual_fare}}' },
    { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
    { title: 'additional_items', value: '{{additional_items}}' }
]
const emojis = [
    "😀", "😁", "😂", "😃", "😉", "😋", "😎", "😍", "😗", "🤗",
    "🤔", "😣", "😫", "😴", "😌", "🤓", "😛", "😜", "😠", "😇",
    
];
const MessageOption = () => {
 
    const [textBoxVisibility, setTextBoxVisibility] = useState([]);
    const [showTextbox, setShowTextbox] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [imageInputValue, setImageInputValue] = useState('');
    const [isQuestionVisible, setIsQuestionVisible] = useState(false);
    const [isImageBoxVisible, setImageBoxVisible] = useState(false);
    const [showImageInput, setShowImageInput] = useState(true);
    const [showImageContainer, setShowImageContainer] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageContainers, setImageContainers] = useState([]);
    const [videoContainers, setVideoContainers] = useState([]);
    const [audioContainers, setAudioContainers] = useState([]);
    const [documentContainers, setDocumentContainers] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isVariablesVisible, setIsVariablesVisible] = useState(false);
    const [isImageEmojiVisible, setIsImageEmojiVisible] = useState(false);
    const [isImageVariablesVisible, setIsImageVariablesVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const questionRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const activeInputRef = useRef(null);
    const containerRef = useRef(null);

    const handleInteraction = (e) => {
        e.stopPropagation();

    };


    const formatText = (command) => {
        document.execCommand(command, false, null);
    };
    const applyCurlyFormatting = (index) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText) {
                const curlyText = `{${selectedText}}`;
                const textNode = document.createTextNode(curlyText);
                range.deleteContents();
                range.insertNode(textNode);
                selection.removeAllRanges();

                // Save curly-formatted text in state
                setTextBoxVisibility((prev) => {
                    const newVisibility = [...prev];
                    newVisibility[index].text = curlyText; // Save curly-formatted text
                    return newVisibility;
                });
            }
        }
    };


    // const handleMessageClick = () => {
    //     // setShowTextbox(true);
    //     setTextBoxVisibility((prev) => [...prev, { showTextContainer: true, isQuestionVisible: false }]);
    // };
    const handleMessageClick = () => {
        setTextBoxVisibility((prev) => [
            ...prev,
            { showTextContainer: true, isQuestionVisible: false, text: '' }
        ]);
    };
    // const handleInputClick = (index) => {
    //     setTextBoxVisibility((prev) => {
    //         const newVisibility = [...prev];


    //         if (currentIndex === index) {
    //             newVisibility[index].isQuestionVisible = !newVisibility[index].isQuestionVisible;
    //             newVisibility[index].showTextContainer = !newVisibility[index].isQuestionVisible; // Toggle showTextContainer
    //         } else {
    //             // Hide the previously opened question and show the text container
    //             if (currentIndex !== null) {
    //                 newVisibility[currentIndex].isQuestionVisible = false; // Hide previous question
    //                 newVisibility[currentIndex].showTextContainer = true; // Show previous text container
    //             }

    //             newVisibility[index].isQuestionVisible = true;
    //             newVisibility[index].showTextContainer = false;
    //             setCurrentIndex(index); // Update currentIndex to the new index
    //         }

    //         return newVisibility;
    //     });
    //     // setShowTextbox(false);
    //     // setIsQuestionVisible(true);
    //     setImageBoxVisible(false);
    //     setShowImageInput(true);
    // };
    const handleInputClick = (index) => {
        setTextBoxVisibility((prev) => {
            const newVisibility = [...prev];
            if (currentIndex === index) {
                newVisibility[index].isQuestionVisible = !newVisibility[index].isQuestionVisible;
                newVisibility[index].showTextContainer = !newVisibility[index].isQuestionVisible;
            } else {
                if (currentIndex !== null) {
                    newVisibility[currentIndex].isQuestionVisible = false;
                    newVisibility[currentIndex].showTextContainer = true;
                }
                newVisibility[index].isQuestionVisible = true;
                newVisibility[index].showTextContainer = false;
                setCurrentIndex(index);
            }
            return newVisibility;
        });
    };
    const handleBlur = (index, e) => {
        const newText = e.currentTarget.innerHTML; // Capture formatted HTML
        setTextBoxVisibility((prev) => {
            const newVisibility = [...prev];
            newVisibility[index].text = newText; // Update text with HTML content on blur
            return newVisibility;
        });
    };

    const handleImageInputClick = () => {
        setImageBoxVisible(true);
        setShowImageInput(false);
        setShowTextbox(true);
        setIsQuestionVisible(false);
    }
    const toggleVariablesDropdown = () => {
        setIsVariablesVisible((prev) => !prev);
        setIsVisible(false);
    };
    const toggleImageVariableDropdown = () => {
        setIsImageVariablesVisible((prev) => !prev);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
  
    const toggleEmojiPicker = () => {
        setIsVisible((prev) => !prev);
        setIsVariablesVisible(false);
    };
    const toggleImageEmojiPicker = () => {
        setIsImageEmojiVisible((prev) => !prev);
    }
    // const handleEmojiClick = (emoji) => {
    //     setInputValue(prev => prev + emoji);
    //     setIsVisible(false);
    // };
    const handleEmojiClick = (emoji) => {
        if (activeInputRef.current) {
            const currentHTML = activeInputRef.current.innerHTML;
            activeInputRef.current.innerHTML = currentHTML + emoji;
            handleBlur(currentIndex, { currentTarget: activeInputRef.current }); // Update state with new HTML content
        }
        setIsVisible(false);
    };
    const handleImageEmojiClick = (emoji) => {
        setImageInputValue(prev => prev + emoji);
        setIsImageEmojiVisible(false);
    }
    const handleVariableClick = (variable) => {
        if (activeInputRef.current) {
            const currentHTML = activeInputRef.current.innerHTML;
            activeInputRef.current.innerHTML = currentHTML + variable.value;
            handleBlur(currentIndex, { currentTarget: activeInputRef.current }); // Update state with new HTML content
        }
        // setInputValue(prev => prev + variable.value);
        setIsVariablesVisible(false);
    };
    const handleImageVariableClick = (variable) => {
        setImageInputValue(prev => prev + variable.value);
        setIsImageVariablesVisible(false);
    }
    const handleMessageDelete = (index) => {
        //setShowTextbox(false);
        setTextBoxVisibility((prev) => prev.filter((_, i) => i !== index));

        if (currentIndex === index) {
            setCurrentIndex(null);
        }

    }

    const handleImageDelete = (index) => {
        // setShowImageContainer(false);
        setImageContainers(prev => prev.filter((_, i) => i !== index));
    }

    const handleImageUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageContainers(prev => {
                    const newContainers = [...prev];
                    newContainers[index] = reader.result;
                    return newContainers;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    //video
    const handleImageClick = () => {
        setImageContainers(prev => [...prev, null]);
    }
    const handleVideoClick = () => {
        setVideoContainers(prev => [...prev, null]);
    };

    const handleVideoUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoContainers(prev => {
                    const newContainers = [...prev];
                    newContainers[index] = reader.result; // Update specific container
                    return newContainers;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoDelete = (index) => {
        setVideoContainers(prev => prev.filter((_, i) => i !== index));
    };

    //Audio
    const handleAudioClick = () => {
        setAudioContainers(prev => [...prev, null]);
    };
    const handleAudioUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAudioContainers(prev => {
                    const newContainers = [...prev];
                    newContainers[index] = reader.result;
                    return newContainers;
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAudioDelete = (index) => {
        setAudioContainers(prev => prev.filter((_, i) => i !== index));
    };

    //Document
    const handleDocumentClick = () => {
        setDocumentContainers(prev => [...prev, { file: null, name: '' }]);
    };
    const handleDocumentUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDocumentContainers(prev => {
                    const newContainers = [...prev];
                    newContainers[index] = { file: reader.result, name: file.name };
                    return newContainers;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDocumentDelete = (index) => {
        setDocumentContainers(prev => prev.filter((_, i) => i !== index));
    };

    // prevent the drag and drop functionality inside the inputbox
    useEffect(() => {
        // Function to prevent any movement inside the container
        const preventDrag = (e) => {
            if (questionRef.current && questionRef.current.contains(e.target)) {
                e.stopPropagation();
            }
        };


        // Attach listeners
        document.addEventListener('mousemove', preventDrag, true);
        document.addEventListener('mousedown', preventDrag, true);
        document.addEventListener('mouseup', preventDrag, true);

        // Cleanup function to remove listeners on component unmount
        return () => {
            document.removeEventListener('mousemove', preventDrag, true);
            document.removeEventListener('mousedown', preventDrag, true);
            document.removeEventListener('mouseup', preventDrag, true);

        };
    }, []);

    // Close the question text container if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Close question and show text container
                if (currentIndex !== null) {
                    setTextBoxVisibility((prev) => {
                        const newVisibility = [...prev];
                        newVisibility[currentIndex].isQuestionVisible = false;
                        newVisibility[currentIndex].showTextContainer = true;
                        return newVisibility;
                    });
                }
            }
        };

        // Add event listener to detect clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentIndex]);
    return (
        <>
            {textBoxVisibility.map((item, index) => (
                <>
                    {item.showTextContainer && (
                        <>
                            <div style={{ position: 'relative' }} >

                                <div
                                    className='edit__text__input message_input_box'
                                    contentEditable={false} // Prevent editing in `showTextContainer`
                                    dangerouslySetInnerHTML={{ __html: item.text }} // Render stored HTML
                                    onClick={() => handleInputClick(index)}
                                    style={{ height: '35px' }}
                                >

                                </div>

                                <button className='message_delete_icon' style={{ top: '0%' }} onClick={() => handleMessageDelete(index)}>
                                   <DeleteOutlineIcon sx={style.deleteIconHover}/>
                                </button>
                            </div>

                        </>
                    )}
                    {item.isQuestionVisible && (
                        <div className='question_text_content' ref={(el) => {
                            questionRef.current = el; // Attach ref for drag and drop
                            containerRef.current = el; // Attach ref for outside click detection
                        }}>

                            <div className='question_editor_container' >


                                <div
                                    className='message_edit__text__input question_editor_text'
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    dangerouslySetInnerHTML={{ __html: item.text }} // Display stored HTML on edit
                                    onBlur={(e) => handleBlur(index, e)}
                                    onClick={(e) => {
                                        activeInputRef.current = e.currentTarget; // Set the active input ref
                                    }}
                                ></div>
                                <div className='question_editor_toolbar'>
                                    <div className='inline_toolbar'>
                                        <div className='option_toolbar' onClick={() => formatText('bold')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
                                        </div>
                                        <div className='option_toolbar' onClick={() => formatText('italic')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
                                        </div>
                                        <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
                                        </div>
                                        <div className='option_toolbar' onClick={() => applyCurlyFormatting(index)}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
                                        </div>
                                        <div className='option_toolbar' onClick={toggleEmojiPicker}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
                                        </div>

                                    </div>
                                    <div className='question_variable_btn'>
                                        <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
                                    </div>
                                </div>
                            </div>
                            {isVisible && (
                                <div className="emoji_dropdown">
                                    {emojis.map((emoji, index) => (
                                        <span
                                            key={index}
                                            className="emoji_icon"
                                            onClick={() => handleEmojiClick(emoji)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {isVariablesVisible && (
                                
                                <VariablesDropdown
                                    variables={variables}
                                    contactAttributes={contactAttributes}
                                    searchTerm={searchTerm}
                                    handleSearchChange={handleSearchChange}
                                    handleHeaderVariableClick={handleVariableClick}
                                />
                            )}
                        </div>
                    )}
                </>
            ))}
            {imageContainers.map((image, index) => (
                <div key={index} className='image_container'>
                    <div className='message_image_content'>
                        {image ? (
                            <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <ImageIcon />
                        )}
                    </div>
                    <ButtonComponent label='Upload image' onClick={() => document.getElementById(`image-input-${index}`).click()} customBtn='image_upload cancel_button_style' />
                   
                    <button className='message_delete_icon' onClick={() => handleImageDelete(index)}>
                        <DeleteOutlineIcon sx={style.deleteIconHover} />
                    </button>
                    {
                        showImageInput && (
                            <div className='edit__text__input message_input_box image_text_input_field'
                                contentEditable
                                suppressContentEditableWarning={true}
                                onInput={(e) => setImageInputValue(e.currentTarget.innerHTML)}
                                dangerouslySetInnerHTML={{ __html: imageInputValue }} onClick={handleImageInputClick}></div>
                        )
                    }

                    {isImageBoxVisible && (
                        <div className='question_text_content image_text_input_field' ref={questionRef} >

                            <div className='question_editor_container' onMouseDown={handleInteraction} onTouchStart={handleInteraction}>

                                <div
                                    className='message_edit__text__input question_editor_text'
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    onInput={(e) => setImageInputValue(e.currentTarget.innerHTML)}
                                    onFocus={() => setShowImageInput(false)}
                                    dangerouslySetInnerHTML={{ __html: imageInputValue }}
                                >

                                </div>
                                <div className='question_editor_toolbar'>
                                    <div className='inline_toolbar'>
                                        <div className='option_toolbar' onClick={() => formatText('bold')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
                                        </div>
                                        <div className='option_toolbar' onClick={() => formatText('italic')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
                                        </div>
                                        <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
                                        </div>
                                        <div className='option_toolbar' onClick={applyCurlyFormatting}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
                                        </div>
                                        <div className='option_toolbar' onClick={toggleImageEmojiPicker}>
                                            <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
                                        </div>

                                    </div>
                                    <div className='question_variable_btn'>
                                        <button className='btn btn-success variable_btn' onClick={toggleImageVariableDropdown} >Variables  </button>
                                    </div>
                                </div>
                            </div>
                            {isImageEmojiVisible && (
                                <div className="emoji_dropdown">
                                    {emojis.map((emoji, index) => (
                                        <span
                                            key={index}
                                            className="emoji_icon"
                                            onClick={() => handleImageEmojiClick(emoji)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {isImageVariablesVisible && (
                                  <VariablesDropdown
                                  variables={variables}
                                  contactAttributes={contactAttributes}
                                  searchTerm={searchTerm}
                                  handleSearchChange={handleSearchChange}
                                  handleHeaderVariableClick={handleImageVariableClick}
                              />
                              
                            )}
                        </div>
                    )}
                    <input
                        type='file'
                        id={`image-input-${index}`}
                        className='edt__text__input image_input_box'
                        style={{ display: "none" }}
                        onChange={(event) => handleImageUpload(event, index)}
                    />

                </div>
            ))}

            {videoContainers.map((video, index) => (
                <div key={index} className='image_container'>
                    <div className='message_image_content'>
                        {video ? (
                            <video controls style={{ width: '100%', height: '100%' }}>
                                <source src={video} type="video/mp4" />
                            </video>
                        ) : (
                            <MovieIcon />
                        )}
                    </div>
                    <ButtonComponent label='Upload Video'  onClick={() => document.getElementById(`video-input-${index}`).click()}
                        customBtn='cancel_button_style image_upload'/>
                 
                    <button className='message_delete_icon' onClick={() => handleVideoDelete(index)}>
                        <DeleteOutlineIcon sx={style.deleteIconHover}/>

                        </button>
                    <input
                        type='file'
                        id={`video-input-${index}`}
                        className='edt__text__input image_input_box'
                        style={{ display: "none" }}
                        onChange={(event) => handleVideoUpload(event, index)}
                    />
                </div>
            ))}

            {audioContainers.map((audio, index) => (
                <div key={index} className='image_container'>
                    <div className='message_image_content'>
                        {audio ? (
                            <audio controls style={{ width: '100%' }}>
                                <source src={audio} />
                            </audio>
                        ) : (
                            <AudiotrackIcon />
                        )}
                    </div>
                    <ButtonComponent label='Upload audio'  onClick={() => document.getElementById(`audio-input-${index}`).click()}
                        customBtn='cancel_button_style image_upload'/>
                   
                    <button className='message_delete_icon' onClick={() => handleAudioDelete(index)}>
                     <DeleteOutlineIcon sx={style.deleteIconHover}/>
                     </button>
                    <input
                        type='file'
                        id={`audio-input-${index}`}
                        className='edt__text__input image_input_box'
                        style={{ display: "none" }}
                        onChange={(event) => handleAudioUpload(event, index)}
                    />
                </div>
            ))}

            {documentContainers.map((doc, index) => (
                <div key={index} className='image_container'>
                    <div className='message_image_content'>
                        <DescriptionOutlinedIcon />
                    </div>
                    {doc.file && (
                        <a href={doc.file} className='selecteddoc_link'>{doc.name}</a>
                    )}
                                 <ButtonComponent label='Upload document'  onClick={() => document.getElementById(`document-input-${index}`).click()}
                        customBtn='cancel_button_style image_upload'/>
                   
                    <button className='message_delete_icon' onClick={() => handleDocumentDelete(index)}>
                        <DeleteOutlineIcon sx={style.deleteIconHover}/>
                    
                        </button>
                    <input
                        type='file'
                        id={`document-input-${index}`}
                        className='edt__text__input image_input_box'
                        style={{ display: "none" }}
                        onChange={(event) => handleDocumentUpload(event, index)}
                    />
                </div>
            ))}
            <div className='choose_msg_list'>
                <ButtonComponent label='Message' onClick={handleMessageClick} customBtn='cancel_button_style choose_msg_btn' />
                <ButtonComponent label='Image' onClick={handleImageClick} customBtn='cancel_button_style choose_msg_btn' />
                <ButtonComponent label='Video' onClick={handleVideoClick} customBtn='cancel_button_style choose_msg_btn' />
                <ButtonComponent label='Audio' onClick={handleAudioClick} customBtn='cancel_button_style choose_msg_btn' />
                <ButtonComponent label='Document' onClick={handleDocumentClick} customBtn='cancel_button_style choose_msg_btn' />
            </div>
        </>
    )
}
export default MessageOption;