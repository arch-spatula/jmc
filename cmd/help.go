package cmd

import "fmt"

// 도움말을 출력함
func Help() {
	fmt.Println("Usage: jmc <command>")
	fmt.Println("Commands:")
	fmt.Println("  help - 도움말 출력")
	fmt.Println("  wiki - 위키 출력")
	fmt.Println("  version - 버전 출력")
}
