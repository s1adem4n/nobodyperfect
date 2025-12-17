package main

import (
	"crypto/rand"
	"fmt"
)

const charset = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

func generateCode(n int) (string, error) {
	if n <= 0 {
		return "", fmt.Errorf("n>0 required")
	}
	b := make([]byte, n)
	// fill with random indices
	for i := range n {
		var idxByte [1]byte
		if _, err := rand.Read(idxByte[:]); err != nil {
			return "", err
		}
		// map random byte to index in charset
		idx := int(idxByte[0]) % len(charset)
		b[i] = charset[idx]
	}
	return string(b), nil
}
