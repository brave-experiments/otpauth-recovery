# otpauth-recovery
Generate QR codes for otpauth URLs.

# Installation

        npm install -g otpauth-recovery

# Usage

Create a `json` file containing an array of one or more entries, e.g.,

        [ 
          { "url": "otpauth://totp/issuer:accountName?secret=ABCDEFGHIJKLMNOPQRSTUVXYZ234567" }
        ]

The `url` property of each entry must conform to the
[OTPauth URI format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format).

Now run:

        % otpauth-recovery input.json > /Volumes/NO\ Name/output.html

The output file should be saved to a "secure USB" stick for initializing your OTP device and providing a recovery mechanism.

The output `html` file contains a [QR code](https://en.wikipedia.org/wiki/QR_code) that corresponds to the `url` property, e.g.,

<img width="300" height="300" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAAAAAAb2I2mAAACwElEQVR42u3bQZKjMAwF0Nz/0jPr6Wqc/02IMfNYdRUE/FioZUm8/jz9eBESEhISEhISEhISEhISEhLuK3y9P35c99vPftzv8Pbj6/pVERISbiQ8Dk7/kg6fPr44pR9enK6ZkJDw9sJ+0cGD01c0fu7hWUJCwmcJA2Z69rcsMH0dhISEjxaON3rj+Dq+hJCQ8H8SBmfHFaFDSJCcnVkVISHhHsJ+x/aNv1ZU9QkJCS8Rdn3y97vCNNxWK//epAIhIeElwsklTDbCqnJUukMlJCS8vfDwNmlJKaUHz0hf9MR/C0JCwpsIqzGfYOXjCcdu5cNwS0hIuIcwSL/SXG08PB100tKoSkhIuJEwCHZByEw1/b50/EhCQsI9hJPp12S4repZ1RsjJCTcQ5iGzHEATM8Gmmv6+ISEhAuEaTY2rn6nHfgzwXO25k1ISHgTYVovSnHpTdN07pPTl4SEhAuEQQG6iqpBaE2niKrOPyEh4Z2Fn4mgVe4XDAf0XThCQsI7C6ujaolVrbh00np2NpGQkHCpsE/Ygs3aZIstoBMSEm4p7POoKsVL75zmg7NZGyEh4XphSu/7YuMUL6hdfXxiiJCQcKkwmEE+8zlWvMpLsjZCQsI7CScf13+c0RemkgI5ISHhPYXpNvCDQXG8Lx3T36yFkJDwxsJgldUXFZPbxWBq4NT0JSEh4VLh6Tp4kJdNXhfkfoSEhBsJq+59cLbaH6Ylr6snFQgJCS8RVtvAtEMWZFlVg//8l12EhIRLhf0WrQ+twW/7uE5ISLibMChoT/bPgpeaxtJrumuEhITfFQbhcfIlTG4I04yPkJDwgcLJTlo6DdDXswgJCR8jDFK3Pm5WGRohIeEThH0zPx1iTt/E5OASISHhHsK05p3mdGltPJ0pOJ+1ERISLhU+6iAkJCQkJCQkJCQkJCQkJCTc4/gLwKp5qjnv3iMAAAAASUVORK5CYII=" />

The ideal set-up is to then store the OTP credentials on a hardware device
(e.g., a [YubiKey 4](https://www.yubico.com/product/yubikey-4-series/#yubikey-4)
or [YubiKey 4C](https://www.yubico.com/product/yubikey-4-series/#yubikey-4c),
using a program
(e.g.,
[Yubico Authenticator](https://www.yubico.com/support/knowledge-base/categories/articles/yubico-authenticator-download/)).
