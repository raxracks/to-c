#include <stdio.h>

void main() {
    //printf("\033[0m");printf("\e[1;1H\e[2J");

    int i = 0;
    for(; i <= 8; i++) {
        if(i % 3 == 1) {
            printf("\033[0;31m");printf("number: %d\n", i);
        } else if(i % 3 == 2) {
            printf("\033[0;33m");printf("number: %d\n", i);
        } else {
            printf("\033[0m");printf("number: %d\n", i);
        }
    }

    printf("\033[0m");printf(""); // reset color
}

