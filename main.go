package main

import (
	"fmt"
	"os"
)

const version = "0.1.0"

func main() {
	switch os.Args[1] {
	case "-h":
		fallthrough
	case "help":
		fmt.Println("Usage: jmc <command>")
		fmt.Println("Commands:")
		fmt.Println("  help - 도움말 출력")
		fmt.Println("  wiki - 위키 출력")
		fmt.Println("  version - 버전 출력")
		os.Exit(0)
	case "-w":
		fallthrough
	case "wiki":
		fmt.Println("개발 예정")
		os.Exit(0)
	case "-v":
		fallthrough
	case "version":
		fmt.Printf("jmc version %s\n", version)
		// git pull릉 통해 버전을 비교
		os.Exit(0)
	case "update":
		fmt.Println("개발 예정")
		os.Exit(0)
	case "init":
		fmt.Println("개발 예정")
		os.Exit(0)
	case "config":
		fmt.Println("개발 예정")
		os.Exit(0)
	default:
		// 아무 명령어가 없으면 식당을 출력함
		// fmt.Fprintf(os.Stderr, "알 수 없는 명령어: %s\n", os.Args[1])
		// os.Exit(1)
		os.Exit(0)
	}
}
