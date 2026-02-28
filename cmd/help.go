package cmd

import "fmt"

// 도움말을 출력함
func Help() {
	fmt.Println("Usage: jmc <command>")
	fmt.Println("Commands:")
	fmt.Println("  -i, init - 초기화 출력")
	fmt.Println("  -h, help - 도움말 출력")
	fmt.Println("  -w, wiki - 위키 출력")
	fmt.Println("  -v, version - 버전 출력")
}
