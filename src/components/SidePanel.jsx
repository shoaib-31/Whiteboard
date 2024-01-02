import { useState } from "react";
import styled from "styled-components";
import { CirclePicker } from "react-color";
import transparent from "/transparentbg.png";
import { GoDash } from "react-icons/go";
const colors = ["#000", "#00f", "#0f0", "#f00", "#ff7c25"];
const backgroundOptions = [
  "transparent",
  "#8080ff",
  "#79ff90",
  "#63f7ff",
  "#fca2ff",
];

const SidePanel = () => {
  const [selectedProps, setSelectedProps] = useState({
    stroke: colors[0],
    background: backgroundOptions[0],
    strokeWidth: 2,
  });
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);

  const handleColorChange = (color, type) => {
    setSelectedProps({
      ...selectedProps,
      [type]: color,
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
  const handleStrokeWidthChange = (width) => {
    setSelectedProps({
      ...selectedProps,
      strokeWidth: width,
    });
  };

  return (
    <Main>
      <Section>
        <Head>Stroke</Head>
        <Options>
          {colors.map((color, i) => (
            <RadioLabel key={i} style={{ backgroundColor: color }}>
              <input
                type="radio"
                name="strokeOptions"
                value={color}
                checked={selectedProps.stroke === color}
                onChange={() => handleColorChange(color, "stroke")}
              />
            </RadioLabel>
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
            style={{ backgroundColor: selectedProps.stroke }}
            onClick={toggleStrokeColorPicker}
          >
            <input
              type="radio"
              name="strokeOptions"
              value={selectedProps.stroke}
              checked={selectedProps.stroke === selectedProps.stroke}
              onChange={() => handleColorChange(selectedProps.stroke, "stroke")}
            />
          </RadioLabel>
          {showStrokeColorPicker && (
            <ColorPickerContainer>
              <CirclePicker
                color={selectedProps.stroke}
                onChangeComplete={(color) =>
                  handleColorChange(color.hex, "stroke")
                }
              />
            </ColorPickerContainer>
          )}
        </Options>
      </Section>
      <Section>
        <Head>Background</Head>
        <Options>
          {backgroundOptions.map((color, i) => (
            <RadioLabel
              title={color}
              key={i}
              style={
                color == "transparent"
                  ? {
                      backgroundImage: `url(${transparent})`,
                      width: "0.8rem",
                      height: "0.8rem",
                    }
                  : { backgroundColor: color }
              }
            >
              <input
                type="radio"
                name="backgroundOptions"
                value={color}
                checked={selectedProps.background === color}
                onChange={() => handleColorChange(color, "background")}
              />
            </RadioLabel>
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
          >
            <input
              type="radio"
              name="backgroundOptions"
              value={selectedProps.background}
              checked={selectedProps.background === selectedProps.background}
              onChange={() =>
                handleColorChange(selectedProps.background, "background")
              }
            />
          </RadioLabel>
          {showBackgroundColorPicker && (
            <ColorPickerContainer>
              <CirclePicker
                color={selectedProps.background}
                onChangeComplete={(color) =>
                  handleColorChange(color.hex, "background")
                }
              />
            </ColorPickerContainer>
          )}
        </Options>
      </Section>
      <Section>
        <Head style={{ marginBottom: "0.5rem" }}>Stroke Width</Head>
        <Options>
          <RadioLabel2 checked={selectedProps.strokeWidth === 2} title="Thin">
            <GoDash />
            <input
              type="radio"
              name="strokeWidthOptions"
              value={2}
              checked={selectedProps.strokeWidth === 2}
              onChange={() => handleStrokeWidthChange(2)}
            />
          </RadioLabel2>
          <RadioLabel2
            checked={selectedProps.strokeWidth === 4}
            style={{ fontWeight: "600" }}
            title="Dark"
          >
            <GoDash style={{ strokeWidth: 2 }} />
            <input
              type="radio"
              name="strokeWidthOptions"
              value={4}
              checked={selectedProps.strokeWidth === 4}
              onChange={() => handleStrokeWidthChange(4)}
            />
          </RadioLabel2>
          <RadioLabel2
            checked={selectedProps.strokeWidth === 6}
            style={{ fontWeight: "800" }}
            title="Extra Dark"
          >
            <GoDash style={{ strokeWidth: 4 }} />
            <input
              type="radio"
              name="strokeWidthOptions"
              value={6}
              checked={selectedProps.strokeWidth === 6}
              onChange={() => handleStrokeWidthChange(6)}
            />
          </RadioLabel2>
        </Options>
      </Section>
    </Main>
  );
};

export default SidePanel;

const Main = styled.div`
  position: fixed;
  left: 1rem;
  width: fit-content;
  top: ${() => window.innerHeight / 2 - 16 * 16}px;
  height: 30rem;
  z-index: 10;
  border-radius: 10px;
  padding: 1rem;
  background-color: white;
  box-shadow: 5px 5px 10px #d0d0d0, -5px -5px 10px #d0d0d0;
`;

const Section = styled.div`
  margin-bottom: 1rem;
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

  input {
    width: 1.4rem;
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  input:checked + & {
    outline: 1px solid blue;
  }
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

  input {
    width: 1.4rem;
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  left: 100%;
  background-color: white;
  z-index: 1000;
`;
