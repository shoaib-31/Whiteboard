import { useEffect, useState } from "react";
import styled from "styled-components";
import { CirclePicker } from "react-color";
import transparent from "/transparentbg.png";
import { GoDash } from "react-icons/go";
import rounded from "/rounded-corner.svg";
import sharp from "/sharp-corner.svg";
import Slider from "rc-slider";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import "rc-slider/assets/index.css";
import { useRecoilState } from "recoil";
import { activeState, propsState, selectedState, shapesState } from "../Atoms";
const colors = ["#000", "#00f", "#0f0", "#f00", "#ff7c25"];
const backgroundOptions = [
  "transparent",
  "#8080ff",
  "#79ff90",
  "#63f7ff",
  "#fca2ff",
];
const SidePanel = () => {
  const [selectedProps, setSelectedProps] = useRecoilState(propsState);
  const [shapes, setShapes] = useRecoilState(shapesState);
  /* eslint-disable */
  const [state, setState] = useRecoilState(activeState);
  const [isSelected, setIsSelected] = useRecoilState(selectedState);
  /* eslint-disable */
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [shapeName, setShapeName] = useState("");
  useEffect(() => {
    if (!isSelected) {
      setShapeName(state);
    } else if (isSelected) {
      setSelectedProps({
        stroke: isSelected.attrs.stroke,
        background: isSelected.attrs.fill,
        strokeWidth: isSelected.attrs.strokeWidth,
        strokeStyle:
          isSelected.attrs.dash == [10, 5]
            ? "dashed"
            : isSelected.attrs.dash == [2, 5]
            ? "dotted"
            : "solid",
        corners: isSelected.attrs.cornerRadius == 10 ? "round" : "sharp",
        opacity: isSelected.attrs.opacity,
      });
    } else {
      setSelectedProps({
        stroke: colors[0],
        background: backgroundOptions[0],
        strokeWidth: 2,
        strokeStyle: "solid",
        corners: "round",
        opacity: 1,
      });
    }
  }, [isSelected, state]);
  useEffect(() => {
    if (isSelected) {
      const shapeToUpdate = shapes.find((shape) => {
        if (shape.name === "ellipse") {
          return (
            shape.x === isSelected.attrs.x - shape.width / 2 &&
            shape.y === isSelected.attrs.y - shape.height / 2
          );
        }
        return shape.x === isSelected.attrs.x && shape.y === isSelected.attrs.y;
      });
      setShapeName(shapeToUpdate.name);
      if (shapeToUpdate) {
        const updatedShapes = shapes.map((shape) => {
          if (shape === shapeToUpdate) {
            return {
              ...shape,
              stroke: selectedProps.stroke,
              background: selectedProps.background,
              strokeWidth: selectedProps.strokeWidth,
              strokeStyle: selectedProps.strokeStyle,
              corners: selectedProps.corners,
              opacity: selectedProps.opacity,
            };
          } else {
            return shape;
          }
        });
        setShapes(updatedShapes);
      }
    }
  }, [selectedProps, isSelected]);

  const handlePropertyChange = (property, type) => {
    setSelectedProps({
      ...selectedProps,
      [type]: property,
    });
    setShowBackgroundColorPicker(false);
    setShowStrokeColorPicker(false);
  };

  const toggleStrokeColorPicker = () => {
    setShowStrokeColorPicker(!showStrokeColorPicker);
    setShowBackgroundColorPicker(false);
  };

  const toggleBackgroundColorPicker = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker);
    setShowStrokeColorPicker(false);
  };
  const shouldRenderSidePanel =
    isSelected ||
    (["rectangle", "ellipse", "line", "text", "arrow", "pencil"].includes(
      state
    ) &&
      state !== "eraser");
  const handleDelete = () => {
    const updatedShapes = shapes.filter((shape) => {
      if (shape.name === "ellipse") {
        return (
          shape.x !== isSelected.attrs.x - shape.width / 2 &&
          shape.y !== isSelected.attrs.y - shape.height / 2
        );
      }
      return shape.x !== isSelected.attrs.x && shape.y !== isSelected.attrs.y;
    });
    setShapes(updatedShapes);
    setIsSelected(null);
  };
  const handleDuplicate = () => {
    const shapeToDuplicate = shapes.find((shape) => {
      if (shape.name === "ellipse") {
        return (
          shape.x === isSelected.attrs.x - shape.width / 2 &&
          shape.y === isSelected.attrs.y - shape.height / 2
        );
      }
      return shape.x === isSelected.attrs.x && shape.y === isSelected.attrs.y;
    });
    const newShape = { ...shapeToDuplicate };
    newShape.x += 10;
    newShape.y += 10;
    setShapes([...shapes, newShape]);
    setIsSelected(null);
  };
  return (
    shouldRenderSidePanel && (
      <Main>
        {shapeName != "image" && (
          <Section>
            <Head>Stroke</Head>
            <Options>
              {colors.map((color, i) => (
                <RadioLabel
                  onClick={() => handlePropertyChange(color, "stroke")}
                  key={i}
                  checked={selectedProps.stroke === color}
                  style={{ backgroundColor: color }}
                ></RadioLabel>
              ))}
              <span
                style={{
                  backgroundColor: "#c3c3c3",
                  width: "1px",
                  height: "2rem",
                }}
              ></span>
              <RadioLabel
                title="Custom Stroke"
                checked={false}
                style={{ backgroundColor: selectedProps.stroke }}
                onClick={toggleStrokeColorPicker}
              ></RadioLabel>
              {showStrokeColorPicker && (
                <ColorPickerContainer>
                  <CirclePicker
                    color={selectedProps.stroke}
                    onChangeComplete={(color) =>
                      handlePropertyChange(color.hex, "stroke")
                    }
                  />
                </ColorPickerContainer>
              )}
            </Options>
          </Section>
        )}
        {shapeName != "line" &&
          shapeName != "arrow" &&
          shapeName != "image" &&
          shapeName != "eraser" &&
          shapeName != "pencil" &&
          shapeName != "text" && (
            <Section>
              <Head>Background</Head>
              <Options>
                {backgroundOptions.map((color, i) => (
                  <RadioLabel
                    checked={selectedProps.background === color}
                    title={color}
                    key={i}
                    onClick={() => handlePropertyChange(color, "background")}
                    style={
                      color == "transparent"
                        ? {
                            backgroundImage: `url(${transparent})`,
                            width: "0.8rem",
                            height: "0.8rem",
                          }
                        : { backgroundColor: color }
                    }
                  ></RadioLabel>
                ))}
                <span
                  style={{
                    backgroundColor: "#c3c3c3",
                    width: "1px",
                    height: "2rem",
                  }}
                ></span>
                <RadioLabel
                  title="Custom Background"
                  checked={false}
                  style={
                    selectedProps.background
                      ? {
                          backgroundImage: `url(${transparent})`,
                          width: "0.8rem",
                          height: "0.8rem",
                        }
                      : { backgroundColor: selectedProps.background }
                  }
                  onClick={toggleBackgroundColorPicker}
                ></RadioLabel>
                {showBackgroundColorPicker && (
                  <ColorPickerContainer>
                    <CirclePicker
                      color={selectedProps.background}
                      onChangeComplete={(color) =>
                        handlePropertyChange(color.hex, "background")
                      }
                    />
                  </ColorPickerContainer>
                )}
              </Options>
            </Section>
          )}
        {shapeName != "image" && (
          <Section>
            <Head style={{ marginBottom: "0.5rem" }}>Stroke Width</Head>
            <Options>
              <RadioLabel2
                onClick={() => handlePropertyChange(2, "strokeWidth")}
                checked={selectedProps.strokeWidth === 2}
                title="Thin"
              >
                <GoDash />
              </RadioLabel2>
              <RadioLabel2
                checked={selectedProps.strokeWidth === 4}
                style={{ fontWeight: "600" }}
                title="Dark"
                onClick={() => handlePropertyChange(4, "strokeWidth")}
              >
                <GoDash style={{ strokeWidth: 2 }} />
              </RadioLabel2>
              <RadioLabel2
                checked={selectedProps.strokeWidth === 6}
                style={{ fontWeight: "800" }}
                title="Extra Dark"
                onClick={() => handlePropertyChange(6, "strokeWidth")}
              >
                <GoDash style={{ strokeWidth: 4 }} />
              </RadioLabel2>
            </Options>
          </Section>
        )}
        {shapeName != "image" && (
          <Section>
            <Head style={{ marginBottom: "0.5rem" }}>Stroke style</Head>
            <Options>
              <RadioLabel2
                checked={selectedProps.strokeStyle === "solid"}
                title="Solid"
                onClick={() => handlePropertyChange("solid", "strokeStyle")}
              >
                <GoDash />
              </RadioLabel2>
              <RadioLabel2
                checked={selectedProps.strokeStyle === "dashed"}
                style={{ fontWeight: "600", fontSize: "6px" }}
                title="Dashed"
                onClick={() => handlePropertyChange("dashed", "strokeStyle")}
              >
                - - -
              </RadioLabel2>
              <RadioLabel2
                checked={selectedProps.strokeStyle === "dotted"}
                style={{ fontWeight: "700", fontSize: "10px" }}
                title="Dotted"
                onClick={() => handlePropertyChange("dotted", "strokeStyle")}
              >
                . . .
              </RadioLabel2>
            </Options>
          </Section>
        )}
        {shapeName != "line" &&
          shapeName != "arrow" &&
          shapeName != "image" &&
          shapeName != "eraser" &&
          shapeName != "pencil" &&
          shapeName != "text" && (
            <Section>
              <Head style={{ marginBottom: "0.5rem" }}>Corners</Head>
              <Options>
                <RadioLabel2
                  checked={selectedProps.corners === "round"}
                  title="Round"
                  onClick={() => handlePropertyChange("round", "corners")}
                >
                  <img src={rounded} />
                </RadioLabel2>
                <RadioLabel2
                  checked={selectedProps.corners === "sharp"}
                  style={{ fontWeight: "600", fontSize: "6px" }}
                  title="Sharp"
                  onClick={() => handlePropertyChange("sharp", "corners")}
                >
                  <img src={sharp} />
                </RadioLabel2>
              </Options>
            </Section>
          )}
        {shapeName != "image" && (
          <Section>
            <Head style={{ marginBottom: "0.5rem" }}>Opacity</Head>
            <Options>
              <Slider
                min={0}
                max={100}
                step={1}
                trackStyle={{ backgroundColor: "#875fff", height: "6px" }}
                handleStyle={{
                  borderColor: "#875fff",
                  height: "14px",
                  backgroundColor: "#6f42f9",
                  width: "14px",
                  marginTop: "-4px",
                }}
                activeDotStyle={{
                  borderColor: "#875fff",
                  height: "14px",
                  width: "14px",
                  marginTop: "-4px",
                }}
                value={selectedProps.opacity * 100}
                onChange={(value) =>
                  handlePropertyChange(value / 100, "opacity")
                }
              />
            </Options>
          </Section>
        )}
        <Section>
          <Head style={{ marginBottom: "0.5rem" }}>Actions</Head>
          <Button title="Delete" onClick={handleDelete}>
            <FaRegTrashAlt />
          </Button>
          <Button title="Duplicate" onClick={handleDuplicate}>
            <MdContentCopy />
          </Button>
        </Section>
      </Main>
    )
  );
};

export default SidePanel;

const Main = styled.div`
  position: fixed;
  left: 1rem;
  width: fit-content;
  top: ${() => window.innerHeight / 2 - 16 * 16}px;
  height: fit-content;
  z-index: 10;
  border-radius: 10px;
  padding: 1rem;
  background-color: white;
  box-shadow: 5px 5px 10px #d0d0d0, -5px -5px 10px #d0d0d0;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;
const Button = styled.button`
  aspect-ratio: 1/1;
  height: 2rem;
  border-radius: 4px;
  border: none;
  outline: none;
  margin-right: 0.5rem;
  background-color: #f5eeff;
  cursor: pointer;
`;

const Head = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
`;

const Options = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  align-items: center;
`;

const RadioLabel = styled.label`
  border-radius: 4px;
  display: block;
  position: relative;
  padding: 2px;
  width: 0.8rem;
  height: 0.8rem;
  cursor: pointer;
  outline: ${(props) => (props.checked ? "1px solid #8387ff" : "none")};
`;
const RadioLabel2 = styled.label`
  border-radius: 4px;
  display: flex;
  position: relative;
  padding: 0.5rem;
  width: 0.8rem;
  background-color: ${(props) => (props.checked ? "#dac3ff" : "#f5eeff")};
  height: 0.8rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: ${(props) => (props.checked ? "1px solid #8387ff" : "none")};
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  left: 100%;
  background-color: white;
  z-index: 1000;
`;
