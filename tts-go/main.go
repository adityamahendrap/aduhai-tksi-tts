package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
	"unicode"
)

type TTSRequest struct {
	Text              string `json:"text"`
	Amplitude         *int   `json:"amplitude"`
	Speed             *int   `json:"speed"`
	Pitch             *int   `json:"pitch"`
	PitchRange        *int   `json:"pitch_range"`
	Voice             string `json:"voice"`
	WordGap           *int   `json:"word_gap"`
	SpellPunctuation  string `json:"spell_punctuation"`
	IgnorePunctuation bool   `json:"ignore_punctuation"`
	LineLength        *int   `json:"line_length"`
}

func buildEspeakArgs(req TTSRequest) ([]string, error) {
	args := []string{req.Text}

	if req.Amplitude != nil {
		if *req.Amplitude >= 0 && *req.Amplitude <= 200 {
			args = append(args, "-a", strconv.Itoa(*req.Amplitude))
		} else {
			return nil, fmt.Errorf("invalid amplitude: must be between 0 and 200")
		}
	}

	if req.Speed != nil {
		if *req.Speed > 0 {
			args = append(args, "-s", strconv.Itoa(*req.Speed))
		} else {
			return nil, fmt.Errorf("invalid speed: must be a positive integer")
		}
	}

	if req.Pitch != nil {
		if *req.Pitch >= 0 && *req.Pitch <= 99 {
			args = append(args, "-p", strconv.Itoa(*req.Pitch))
		} else {
			return nil, fmt.Errorf("invalid pitch: must be between 0 and 99")
		}
	}

	if req.PitchRange != nil {
		if *req.PitchRange >= 0 && *req.PitchRange <= 99 {
			args = append(args, "-P", strconv.Itoa(*req.PitchRange))
		} else {
			return nil, fmt.Errorf("invalid pitch range: must be between 0 and 99")
		}
	}

	if req.Voice != "" {
		args = append(args, "-v", req.Voice)
	}

	if req.WordGap != nil {
		if *req.WordGap >= 0 {
			args = append(args, "-g", strconv.Itoa(*req.WordGap))
		} else {
			return nil, fmt.Errorf("invalid word gap: must be a non-negative integer")
		}
	}

	if req.SpellPunctuation != "" {
		args = append(args, fmt.Sprintf("--punct=\"%s\"", req.SpellPunctuation))
	}

	if req.LineLength != nil {
		if *req.LineLength >= 0 {
			args = append(args, "-l", strconv.Itoa(*req.LineLength))
		} else {
			return nil, fmt.Errorf("invalid line length: must be a non-negative integer")
		}
	}

	outputFolder := "output"
	if _, err := os.Stat(outputFolder); os.IsNotExist(err) {
		os.Mkdir(outputFolder, os.ModePerm)
	}

	outputFile := fmt.Sprintf("%s/output_%d.wav", outputFolder, time.Now().Unix())
	args = append(args, "-w", outputFile)

	return args, nil
}

func textToSpeech(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusOK)
		return
	}

	var req TTSRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf("invalid request body: %v", err), http.StatusBadRequest)
		return
	}
	fmt.Println(req)

	if req.IgnorePunctuation {
		var sb strings.Builder
		for _, r := range req.Text {
			if !unicode.IsPunct(r) {
				sb.WriteRune(r)
			}
		}
		req.Text = sb.String()
	}

	if req.Text == "" {
		http.Error(w, "text is required", http.StatusBadRequest)
		return
	}

	fmt.Println(req)

	args, err := buildEspeakArgs(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	cmd := exec.Command("espeak-ng", args...)
	if err := cmd.Run(); err != nil {
		http.Error(w, fmt.Sprintf("failed to generate speech: %v", err), http.StatusInternalServerError)
		return
	}

	http.ServeFile(w, r, args[len(args)-1])
}

func main() {
	http.HandleFunc("/tts", textToSpeech)
	http.ListenAndServe(":8080", nil)
}
