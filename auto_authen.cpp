#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <ctime>
#include <curl/curl.h>

#define AUTHEN_URL "http://192.168.13.1/login"
#define AUTHEN_POSTFIELDS "username=admin&password=1234"
#define PATH "/home/user/.auto_authen_history"

size_t WriteCallback(char *contents, size_t size, size_t nmemb, void *userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
	
	curl_global_init(CURL_GLOBAL_ALL);
    CURL* curl = curl_easy_init();
    CURLcode res_code;
    std::string res_body;

    curl_easy_setopt(curl, CURLOPT_URL, "http://detectportal.firefox.com/success.txt");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &res_body);
    res_code = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    std::string log;
    std::ofstream fs;
    fs.open(PATH, std::ios::out | std::ios::app);

    if (res_code == CURLE_OK && !res_body.compare("success\n")) {
        log = "aready login";
    } else {

        CURL* curl = curl_easy_init();
        CURLcode res_code;

        curl_easy_setopt(curl, CURLOPT_URL, AUTHEN_URL);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, AUTHEN_POSTFIELDS);
        res_code = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        log = (res_code == CURLE_OK ? "login success" : "login error");
    }

    auto t = std::time(nullptr);
    auto tm = *std::localtime(&t);
    auto time = std::put_time(&tm, "%c %Z");
    fs << time << " : " << log << std::endl;
    fs.close();

	curl_global_cleanup();
    return 0;
}
