function main() {
    //console.clear();

    let i = 0;
    for(; i <= 8; i++) {
        if(i % 3 == 1) {
            console.error("number: %d\n", i);
        } else if(i % 3 == 2) {
            console.warn("number: %d\n", i);
        } else {
            console.log("number: %d\n", i);
        }
    }

    console.log(""); // reset color
}

main();